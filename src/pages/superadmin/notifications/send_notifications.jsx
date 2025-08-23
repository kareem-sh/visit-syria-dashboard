import React, { useState } from 'react';

// The 'App' component from the previous Canvas, now a nested component.
// It handles the form logic and display.

const SendNotification = () => {
    // Use state to manage the form inputs and character count.
    const [title, setTitle] = useState('');
    const [filter, setFilter] = useState('All');
    const [content, setContent] = useState('');
    const maxChars = 1000;

    // Handles the form submission logic.
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted!');
        console.log('Title:', title);
        console.log('Filter:', filter);
        console.log('Content:', content);
        // You would typically send this data to a backend here.
    };

    // Handles the content input, updating state and character count.
    const handleContentChange = (event) => {
        // Only update content if it's within the character limit.
        if (event.target.value.length <= maxChars) {
        setContent(event.target.value);
        }
    };

    return (
            <div>
                <div className="flex mb-8">
                    <h1 className="text-2xl font-semibold text-gray-800" style={{ direction: 'rtl' }}>
                        إرسال إشعار
                    </h1>
                </div>

                {/* The form element itself. */}
                <form onSubmit={handleSubmit}>
                    {/* Top row with Title and Filter inputs. */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        
                        {/* Title input field. Uses RTL styling for Arabic text. */}
                        <div className="relative flex flex-col">
                            <label htmlFor="filter-select" className="mb-1 text-gray-700 font-medium" style={{ direction: 'rtl' }}>
                                العنوان:
                            </label>
                            <input
                                type="text"
                                id="title-input"
                                placeholder="Title*"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-white p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors"
                            />
                        </div>

                        {/* Filter dropdown. */}
                        <div className="relative flex flex-col">
                            <label htmlFor="filter-select" className="mb-1 text-gray-700 font-medium" style={{ direction: 'rtl' }}>
                                الفئة:
                            </label>
                            <select
                                id="filter-select"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full bg-white p-3 rounded-lg border-2 border-gray-200 appearance-none focus:outline-none focus:border-green-500 transition-colors cursor-pointer"
                            >
                                <option value="All">الكل</option>
                                <option value="Option1">Option 1</option>
                                <option value="Option2">Option 2</option>
                            </select>
                            {/* Custom arrow SVG to replicate the design. */}
                            <div className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Content Textarea field. */}
                    <div className="relativeflex flex-col mb-4">
                        <label htmlFor="filter-select" className="mb-1 text-gray-700 font-medium" style={{ direction: 'rtl' }}>
                            المحتوى:
                        </label>
                        <textarea
                            id="content-textarea"
                            placeholder="Content*"
                            value={content}
                            onChange={handleContentChange}
                            rows="8"
                            className="w-full bg-white p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors resize-none"
                            >
                        </textarea>
                        {/* Character counter. */}
                        <div className="text-right text-sm text-gray-400 mt-2" style={{ direction: 'rtl' }}>
                            {content.length}/{maxChars}
                        </div>
                    </div>
                    
                    {/* Submit button with the custom green color and icon. */}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors flex justify-center items-center space-x-2">
                        {/* The right-pointing arrow icon for the RTL layout. */}
                        <span style={{ direction: 'rtl' }}>
                            إرسال
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </form>
            </div>
    );
};

export default SendNotification;