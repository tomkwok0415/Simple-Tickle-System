import { useParams, BrowserRouter, Navigate, Route, Routes, useNavigate,Link, Outlet } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { Component, useState, useEffect } from 'react';

function DefaultPage(props){
    // let {vName} = useParams();

    
    return <div>This is the default page!</div>;
}
export default DefaultPage;