
const questionList = [
    "How satisfied are you with the teaching quality?",
    "Are the classroom facilities good?",
    "How would you rate the library facilities?",
    "Are you satisfied with the college website?",
    "How helpful are the laboratory facilities?",
    "Is the course content useful?",
    "How satisfied are you with the placement support?",
    "Are extracurricular activities sufficient?",
    "How is the cleanliness of the campus?",
    "Would you recommend this institution to others?"
];

// Select random 5 questions
const selectedQuestions = [...questionList]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

const questionsDiv = document.getElementById("questions");

selectedQuestions.forEach((question, index) => {
    questionsDiv.innerHTML += `
        <div class="question">
            <label>${index + 1}. ${question}</label>
            <select name="answer${index + 1}" required>
                <option value="">Select your answer</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
            </select>
        </div>
    `;
});

// Form submission
document.getElementById("surveyForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const department = document.getElementById("department").value;

    const answers = selectedQuestions.map((question, index) => ({
        question: question,
        answer: document.querySelector(`[name="answer${index + 1}"]`).value
    }));

    const message = document.getElementById("message");

    try {
        const response = await fetch("http://localhost:5000/api/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                department,
                answers
            })
        });

        const result = await response.json();

        if (response.ok) {
            message.textContent = "Feedback submitted successfully!";
            message.style.color = "green";
            document.getElementById("surveyForm").reset();
        } else {
            message.textContent = result.message || "Submission failed!";
            message.style.color = "red";
        }

    } catch (error) {
        message.textContent = "Server connection failed!";
        message.style.color = "red";
        console.error(error);
    }
});
