
import { Link } from "react-router-dom";
import "../css/Home.css";

/* Title cards for the options*/

function PlanCard({ title, description, imageUrl }) {
    return (
        <article className="plan-card">
            <img className="card-image" src={imageUrl} alt={description} />
            <h2>{title}</h2>
        </article>
    );
}

function Home() {
    return (
        <>
            <header className="home-header">
                <h1>Gym Nutrition Calculator</h1>
                <nav className="home-nav">
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                </nav>
            </header>
            <main className="home-content">
                <h1 id="welcome">Welcome to the Gym Nutrition Calculator!</h1>
                <section className="plan-grid">
                    <PlanCard
                        title="Generate Gym Plan"
                        description="Create a personalized gym plan based on your goals and preferences."
                        imageUrl="/images/gym.jpg"
                    />
                    <PlanCard
                        title="Generate Nutrition Plan"
                        description="Get a customized nutrition plan to complement your gym routine."
                        imageUrl="/images/food.jpg"
                    />
                    <PlanCard
                        title="Track Progress"
                        description="Monitor your fitness journey and track your progress over time."
                        imageUrl="/images/progress.jpg"
                    />
                    <PlanCard
                        title="Community Blogs"
                        description="Read and share experiences with our fitness community through blogs."
                        imageUrl="/images/blog.jpg"
                    />    
                </section>
                
            </main>
        </>
    );
}

export default Home;