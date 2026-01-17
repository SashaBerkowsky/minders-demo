import { Request, Response, NextFunction } from 'express'
import { ZodType, ZodError } from 'zod'

export const validate = (schema: ZodType) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            })

            return next();
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    error: 'Validation Failed',
                    details: err.issues.map(issue => ({
                        path: issue.path.join('.'),
                        message: issue.message
                    }))
                })
            }

            return next(err)
        }
    }

