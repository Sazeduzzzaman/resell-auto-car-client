import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import useUserToken from '../../hooks/useWebTItle/useUserToken/useUserToken';
import useWebTitle from '../../hooks/useWebTItle/useWebTitle';

const SignUp = () => {
    useWebTitle('Sign Up Page');
    const [loginError, setLoginError] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUser } = useContext(AuthContext);
    const [userCreatedEmail, setUserCreatedEmail] = useState('');
    const [token] = useUserToken(userCreatedEmail)
    const navigate = useNavigate()

    const imgHostBB = process.env.REACT_APP_imgBB_key;
    console.log(imgHostBB)

    if (token) {
        navigate('/');
    }
    const handleSignUp = (data) => {


        setLoginError('')
        createUser(data.email, data.password)
            .then(result => {
                const user = result.user;
                console.log(user)


                const image = data.photURL[0];
                console.log(data.photURL)
                console.log(image);
                const formData = new FormData();
                formData.append('image', image)
                const url = `https://api.imgbb.com/1/upload?&key=${imgHostBB}`;
                console.log(url)
                fetch(url, {
                    method: 'POST',
                    body: formData
                })
                    .then(res => res.json())
                    .then(imgData => {
                        console.log(imgData)
                        if (imgData.success) {
                            console.log()
                            const userInfo = {
                                displayName: data.name,
                                photoURL: imgData.data.url
                            }

                            updateUser(userInfo)
                                .then(() => {
                                    saveUser(data.name, data.email, imgData.data.url, data.role)
                                    toast.sucess('Sign Up SuccessFully Done')
                                })
                                .catch(err => console.error(err))
                        }
                    })
                    .catch(err => console.error(err))
            })

    }

    const saveUser = (name, email, photURL, role) => {

        const user = { name, email, photURL, role };
        fetch('https://resell-autocar-server.vercel.app/users', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => {
                setUserCreatedEmail(email)
            })
    }

    return (
        <div>
            <div className="section text-center pt-5 mb-5">
                <h4 className="mb-4 pb-3 mt-5">Sign Up</h4>
                <form onSubmit={handleSubmit(handleSignUp)} className="pb-5 ">
                    <input
                        {...register("name", {
                            required: 'Name'
                        })}
                        placeholder="Inter Your Name"
                        className='form-style mb-2'
                    />
                    {errors.name && <p className='text-danger '>{errors.name?.message}</p>}

                    <input type="file"
                        {...register("photURL", {
                            required: 'Photo URL Required'
                        })}
                        placeholder="Inter Your PhotoURL"
                        className='form-style mb-2'
                    />
                    {errors.photURL && <p className='text-danger '>{errors.photURL?.message}</p>}

                    <input
                        {...register("email", {
                            required: 'Email Address Required'
                        })}
                        placeholder="Inter Your Email Address"
                        className='form-style mb-2'
                    />
                    {errors.email && <p className='text-danger '>{errors.email?.message}</p>}

                    <select
                        {...register("role", {
                            required: 'Password Required'
                        })}
                        className=" form-style mb-2" aria-label="Default select example">
                        <option selected value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                    </select>
                    {errors.role && <p className='text-danger '>{errors.role?.message}</p>}

                    <input type='password'
                        {...register("password", {
                            required: 'Password Required'
                        })}
                        placeholder="Inter Your Password"
                        className=' form-style'
                    />
                    {errors.password && <p className='text-danger '>{errors.password?.message}</p>}
                    <input type="submit" value='Sign Up' className='btns mt-3' />
                    <div className='text-danger text-center fw-bold'>
                        <p>{loginError.slice(10, 38)}</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;