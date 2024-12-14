import { Router, Request, Response, NextFunction } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import { ObjectId } from 'mongodb';
import { Group } from '../model/Group';


export const configureRoutes = (passport: PassportStatic, router: Router): Router => {

    router.get('/', (req: Request, res: Response) => {
        let myClass = new MainClass();
        res.status(200).send('Hello, World!');
    });

    router.get('/callback', (req: Request, res: Response) => {
        let myClass = new MainClass();
        myClass.monitoringCallback((error, result) => {
            if (error) {
                res.write(error);
                res.status(400).end();
            } else {
                res.write(result);
                res.status(200).end();
            }
        });
    });

    router.get('/promise', async (req: Request, res: Response) => {
        let myClass = new MainClass();
        /* myClass.monitoringPromise().then((data: string) => {
            res.write(data);
            res.status(200).end();
        }).catch((error: string) => {
            res.write(error);
            res.status(400).end();
        }); */


        // async-await
        try {
            const data = await myClass.monitoringPromise();
            res.write(data);
            res.status(200).end();
        } catch (error) {
            res.write(error);
            res.status(400).end();
        }
    });


    router.get('/observable', (req: Request, res: Response) => {
        let myClass = new MainClass();
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        // deprecated variant
        /* myClass.monitoringObservable().subscribe((data) => {
            console.log(data);
        }, (error) => {
            console.log(error);
        }, () => {
            console.log('complete');
        }); */

        myClass.monitoringObservable().subscribe({
            next(data: string) {
                res.write(data);
            }, error(error: string) {
                res.status(400).end(error);
            }, complete() {
                res.status(200).end();
            }
        });
    });

    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: typeof User ) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                if (!user) {
                  
                    res.status(400).send('User not found.');
                } else {
                    req.login(user, (err: string | null) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        } else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });

    router.post('/register', (req: Request, res: Response) => {
        const isAdmin = req.body.isAdmin ? 1 : 0; 
        const isTrainer = 0;
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const userName = req.body.userName;
        const user = new User({email: email, password: password, name: name, userName: userName , isAdmin : isAdmin ,isTrainer : isTrainer });
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        })
    });

    router.post('/createGroup', (req: Request, res: Response) => {
        const name  = req.body.name;
        const trainer = req.body.trainer;
        const limit = Number(req.body.limit)
        const users: string[] = [];
        const quaue: string[] = [];
        const group = new Group({name: name, trainer: trainer, users: users , quaue : quaue , limit : limit});
        group.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        })
    });



    router.post('/joinGroup', (req: Request, res: Response) => {
        //if (req.isAuthenticated()) {

            const groupid = req.body.id;
            const userId = req.body.userId;
            const isFull = Boolean(req.body.isFull);
            const query = Group.findOne({_id: groupid})
            query.then(group => {
                if (group) {
                    if(!isFull) {
                        group.users.push(userId);
                    }else {
                        group.quaue.push(userId);
                    }
                    group.save()
                        .then(updatedGroup => {
                            res.status(200).send(updatedGroup);
                        })
                        .catch(error => {
                            res.status(500).send(error);
                        });
                } else {
                    res.status(404).send({ message: 'Group not found' });
                }
            })
            .catch(error => {
                res.status(500).send(error);
            });

         /*}else {
            res.status(500).send('User is not logged in.');
        }
        */
    });
    

    

    router.get('/getAllGroups', (req: Request, res: Response) => {
    
        const query = Group.find();
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send('Internal server error.');
        })
        
    });

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/getAllUsers', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/getUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = User.findOne({_id: req.user});
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        
        }
    });

    router.post('/makeTrainer', (req: Request, res: Response) => {
        const id = req.query.id;
        const query = User.findOneAndUpdate({_id: id}, {isTrainer: true});
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send('Internal server error.');
        })
        
    });

    router.get('/checkAuth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);            
        } else {
            res.status(500).send(false);
        }
    });

    router.delete('/deleteUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = User.deleteOne({_id: id});
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    return router;
}