import * as React from 'react';

const Home = () => {
    return (
        <>
            <div className="home-content">
                <h1>Authors Example</h1>
                <p>Welcome to the home page of our React frontend application.</p>
                <hr />
                <p><strong>Project Overview:</strong></p>
                <ul>
                    <li>This is a modern React.js single-page application designed for seamless user experiences.</li>
                    <li>The backend is powered by Laravel Lumen, a lightweight PHP micro-framework ideal for API development.</li>
                    <li>Data persistence and business logic are managed through a robust MySQL database.</li>
                </ul>
                <p><strong>Key Features:</strong></p>
                <ul>
                    <li>Secure authentication via JWT tokens stored in local storage.</li>
                    <li>Dynamic routing to manage different views (Home, Authors, Login).</li>
                    <li>Real-time data fetching from the Laravel API.</li>
                </ul>
            </div>
        </>
    );
};

export default Home;
