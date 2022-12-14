import React, { useContext, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthProvider';
import './Header.css';
import { FaTrash } from 'react-icons/fa';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FcLike } from "react-icons/fc";


const Header = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { user, signOutUser } = useContext(AuthContext);
    const mainMenu =
        <>
            <Nav.Link as={NavLink} to={'/home'}>Home</Nav.Link>
            <Nav.Link as={NavLink} to={'/carsCategories'}>Categories</Nav.Link>
            <Nav.Link as={NavLink} to={'/blog'}>Blog</Nav.Link>
            {
                user?.email ?
                    <><Nav.Link as={NavLink} to={'/dashboard'}>Dashboard</Nav.Link></> : <></>
            }
        </>
    const userMenu =
        <>
            <Nav.Link as={NavLink} to={'/login'}>Login</Nav.Link>

        </>


    const handleSignOut = () => {
        signOutUser()
            .then(() => {
                console.log('user Sign out Successfully')
            })
            .catch(err => console.error(err))
    }
    const url = `https://resell-autocar-server.vercel.app/wishlist?email=${user?.email}`;
    const { data: wisListItems = [], refetch } = useQuery(
        ['wishList', user?.email],
        async () => {
            const res = await fetch(url, {
                headers: {
                    authorization: `bearer ${localStorage.getItem('access_token')}`
                }
            });
            const data = await res.json();
            return data;
        }, {
        refetchInterval: 1000,
    })
    const handleRemove = id => {
        fetch(`https://resell-autocar-server.vercel.app/wishlist/${id}`, {
            method: 'DELETE',
            headers: {
                authorization: `bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.modifiedCount > 0) {
                    console.log(data)
                    toast.success('Product Deleted')
                    refetch('')
                }
            })
    }
    return (
        <div className='primary-bg'>
            <Navbar collapseOnSelect expand="lg" variant="dark" sticky-top>
                <Container>
                    <Navbar.Brand as={NavLink} to={'/home'}>
                        <img src="https://i.ibb.co/mG8Dn0Z/logo.png" alt="" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mx-auto">
                            {mainMenu}
                        </Nav>
                        <Nav className="d-flex justify-content-center align-items-center">
                            {user?.uid ?
                                <div className="d-flex justify-content-center align-items-center">
                                    <Nav.Link as={NavLink} onClick={handleSignOut}>SignOut</Nav.Link>
                                    <div>
                                        <Link className='' onClick={handleShow}>
                                            <span className="position-relative end-50 start-100 translate-middle badge rounded-circle  fs-6">
                                                +
                                            </span>
                                            <FcLike className='text-white fs-3'></FcLike>
                                        </Link>

                                        <Offcanvas show={show} onHide={handleClose}>
                                            <Offcanvas.Header closeButton>
                                                <Offcanvas.Title className='fs-2 fw-bold'>Your Chosen Car</Offcanvas.Title>
                                            </Offcanvas.Header>
                                            <Offcanvas.Body>
                                                <div className="container">
                                                    <div className='row'>
                                                        {wisListItems.length && wisListItems.map(items => <div
                                                            key={items._id}>
                                                            <div className="card mb-3" >
                                                                <div className="row ">
                                                                    <div className="col-md-4 border-0">
                                                                        <img src={items.product_img} className="img-fluid rounded" alt="..." style={{ height: "80px" }} />
                                                                    </div>
                                                                    <div className="col-md-8 border-0">
                                                                        <div className="card-body d-flex justify-content-between align-items-center p-0 pt-4">
                                                                            <p className=" fs-6">{items.product_title}</p>
                                                                            <p className=" fs-6">
                                                                                ${items.price}
                                                                            </p>
                                                                            <p className=" ">
                                                                                <button
                                                                                    onClick={() => handleRemove(items._id)}
                                                                                    className='cart'>
                                                                                    <FaTrash></FaTrash>
                                                                                </button>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>)}
                                                    </div>
                                                </div>
                                            </Offcanvas.Body>
                                        </Offcanvas>
                                    </div>
                                    <img className='img-fluid rounded-circle ms-3' style={{ width: '30px', height: "30px" }} src={user?.photoURL} alt="" />
                                </div>
                                :
                                <div>
                                    {userMenu}
                                </div>}
                        </Nav>

                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </div >
    );
};

export default Header;