import React,{lazy} from "react";
import {Navigate} from "react-router-dom";
const Home=lazy(()=>import('../pages/Home'));
const Chapter=lazy(()=>import('../pages/Chapter'));
const Catalogue=lazy(()=>import('../pages/Catalogue'));
const Bookshelf=lazy(()=>import('../pages/Bookshelf'));
const Login=lazy(()=>import('../pages/Login'));


const routes=[
    {
        path:'/home',
        element: <Home/>
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path:'/catalogue',
        element: <Catalogue/>
    },
    {
        path:"chapter",
        element:<Chapter/>
    },
    {
        path:'/bookshelf',
        element: <Bookshelf/>
    },
    {
        path:'/',
        element: <Navigate to={'/home'}/>
    },
    {
        path:'*',
        element: <Navigate to={'/'}/>
    }
]
export default routes;