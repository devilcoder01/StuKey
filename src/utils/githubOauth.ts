
const connectGitHub = async () => {
    showInfo("Redirecting to GitHub for authentication...");
    window.location.href = "http://localhost:5555/api/v1/auth/github/";
}