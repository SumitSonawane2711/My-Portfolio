"use client"
import React, { useState } from 'react'
import { toast } from 'sonner';

export const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submit clicked");

        const {name,email,message} = formData;

        if(!name || !email || !message) {
            toast.error("Please fill all the fields");
            return;
        }

        const response = new Promise ((resolve ,reject) => {
            setTimeout (()=> {
                resolve("api call resolved");
            },1000)
        });

        if (response) {
            toast.success("Message sent successfully");
        } else {
            toast.error("Something went wrong");
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
            <div className='flex flex-col gap-2'>
                <label
                    htmlFor='name'
                    className='text-sm font-medium text-neutral-600 tracking-tight'>Full name</label>
                <input
                    id='name'
                    name='name'
                    type="text"
                    className="shadow px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary "
                    placeholder="Enter your full name"
                    onChange={handleChange}
                    required
                />

                <label
                    htmlFor='email'
                    className='text-sm font-medium text-neutral-600 tracking-tight'>
                    Email Address
                </label>
                <input
                    id='email'
                    name='email'
                    type="email"
                    className="shadow px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary "
                    placeholder="Enter your full name"
                    onChange={handleChange}
                    required
                    resize-none
                />
                <label
                    htmlFor='message'
                    className='text-sm font-medium text-neutral-600 tracking-tight'>
                    Message
                </label>
                <textarea
                    rows={5}
                    id='message'
                    name='message'
                    className="shadow px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary "
                    placeholder="Enter your message"
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md shadow-md hover:bg-primary-dark">
                Send Message
            </button>

        </form>
    )
}
