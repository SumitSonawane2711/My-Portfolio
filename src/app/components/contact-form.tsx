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

        try {
            await new Promise((resolve) => {
                setTimeout(() => {
                resolve("api call resolved");
                }, 1000)
            });
            toast.success("Message sent successfully");
            setFormData({ name: '', email: '', message: '' });
        } catch {
            toast.error("Something went wrong");
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-lg flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            <div className='flex flex-col gap-2'>
                <label
                    htmlFor='name'
                    className='text-sm font-medium tracking-tight text-primary'>Full name</label>
                <input
                    id='name'
                    name='name'
                    type="text"
                    className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-900 shadow focus:outline-none focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label
                    htmlFor='email'
                    className='text-sm font-medium tracking-tight text-primary'>
                    Email Address
                </label>
                <input
                    id='email'
                    name='email'
                    type="email"
                    className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-900 shadow focus:outline-none focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label
                    htmlFor='message'
                    className='text-sm font-medium tracking-tight text-primary'>
                    Message
                </label>
                <textarea
                    rows={5}
                    id='message'
                    name='message'
                    className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-900 shadow focus:outline-none focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                    placeholder="Enter your message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="rounded-md bg-primary px-4 py-2 text-white shadow-md transition-colors hover:bg-neutral-700 dark:text-neutral-950 dark:hover:bg-neutral-300">
                Send Message
            </button>

        </form>
    )
}
