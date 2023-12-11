const User = require('../models/user');
const Rol = require('../models/rol');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys.js');
const storage = require('../utils/cloud_storage.js');

module.exports = {


    login(req, res) {

        const email = req.body.email;
        const password = req.body.password;

        User.findByEmail(email, async (err, myUser) => {
            console.log('ERROR', err);
            console.log('USUARIO', myUser);
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuarios',
                    error: err
                });
            }

            if (!myUser) {
                return res.status(401).json({ //EL CLIENTE NO TIENE AUTORIZACIÓN PARA REALIZAR ESTA PETICIÓN 401
                    success: false,
                    message: 'El email no fue encontrado'
                })
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password)

            if (isPasswordValid) {
                const token = jwt.sign({ id: myUser.id, email: myUser.email }, keys.secretOrKey, {});

                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: JSON.parse(myUser.roles)
                }

                return res.status(201).json({
                    success: true,
                    message: 'El usuario fue autenticado',
                    data: data //El ID del nuevo usuario que se registro
                });

            } else {
                return res.status(401).json({
                    success: false,
                    message: 'El password es incorrecto'
                });
            }
        });
    },

    register(req, res) {

        const user = req.body;// CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        User.create(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuarios',
                    error: err
                })
            }

            return res.status(201).json({
                success: true,
                message: 'El registro se realizó correctamente',
                data: data //El ID del nuevo usuario que se registro
            })
        });

    },
    async registerWithImage(req, res) {

        const user = JSON.parse(req.body.user);// CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }

        User.create(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuarios',
                    error: err
                })
            }

            user.id = `${data}`;
            const token = jwt.sign({ id: user.id, email: user.email }, keys.secretOrKey, {});
            user.session_token = `JWT ${token}`;

            Rol.create(user.id, 3, (err, data => { //3 es el id del rol cliente

                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del Rol de usuario',
                        error: err
                    })
                }
                return res.status(201).json({
                    success: true,
                    message: 'El registro se realizó correctamente',
                    data: user
                })
            }));

        });

    },

    async updateWithImage(req, res) {

        const user = JSON.parse(req.body.user);// CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }

        User.update(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuarios',
                    error: err
                })
            }

            return res.status(201).json({
                success: true,
                message: 'El usuario se actualizó correctamente',
                data: user
            })

        });

    },

    async updateWithoutImage(req, res) {

        const user = req.body;        
        User.updateWithoutImage(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuarios',
                    error: err
                })
            }

            return res.status(201).json({
                success: true,
                message: 'El usuario se actualizó correctamente',
                data: user
            })

        });

    }
}