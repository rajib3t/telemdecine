import React ,{useState, FormEventHandler, useEffect} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { Head, usePage, useForm } from "@inertiajs/react";
import {PageProps} from '@/types'
import {FlashMessageState} from '@/Interfaces/FlashMessageState';
import {FlashMessage} from '@/Components/FlashMessage';


export default function VisitCreate(){
    return (
        <AuthenticatedLayout>
            <></>
        </AuthenticatedLayout>
    );
}
