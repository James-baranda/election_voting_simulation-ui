// --- Candidate Data ---
const candidates = [
    { id: 1, name: 'Alice Johnson', avatar: '🗳️', bio: 'Experienced city council member.' },
    { id: 2, name: 'Bob Smith', avatar: '🎯', bio: 'Tech entrepreneur and reform advocate.' },
    { id: 3, name: 'Carol Lee', avatar: '🌱', bio: 'Environmental activist.' }
];

const VOTE_KEY = 'votedForCandidateId';
const VOTES_KEY = 'votesData';

// --- DOM Elements ---
const candidatesList = document.getElementById('candidates-list');
const adminResetBtn = document.getElementById('admin-reset');
const chartCanvas = document.getElementById('results-chart');

// --- Voting State ---
function getVotes() {
    const stored = localStorage.getItem(VOTES_KEY);
    if (stored) return JSON.parse(stored);
    // Initialize votes to 0 for each candidate
    const votes = {};
    candidates.forEach(c => votes[c.id] = 0);
    return votes;
}
function setVotes(votes) {
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}
function getVotedCandidateId() {
    return localStorage.getItem(VOTE_KEY);
}
function setVotedCandidateId(id) {
    localStorage.setItem(VOTE_KEY, id);
}
function clearVote() {
    localStorage.removeItem(VOTE_KEY);
}
function clearVotes() {
    localStorage.removeItem(VOTES_KEY);
}

// --- Render Candidates ---
function renderCandidates() {
    candidatesList.innerHTML = '';
    const votedId = getVotedCandidateId();
    candidates.forEach(candidate => {
        const card = document.createElement('div');
        card.className = 'candidate-card';
        const info = document.createElement('div');
        info.className = 'candidate-info';
        const avatar = document.createElement('div');
        avatar.className = 'candidate-avatar';
        avatar.textContent = candidate.avatar;
        const name = document.createElement('span');
        name.className = 'candidate-name';
        name.textContent = candidate.name;
        const bio = document.createElement('span');
        bio.className = 'candidate-bio';
        bio.textContent = ' - ' + candidate.bio;
        info.appendChild(avatar);
        info.appendChild(name);
        info.appendChild(bio);
        const voteBtn = document.createElement('button');
        voteBtn.className = 'vote-btn';
        voteBtn.textContent = votedId == candidate.id ? 'Voted' : 'Vote';
        voteBtn.disabled = !!votedId;
        voteBtn.onclick = () => handleVote(candidate.id);
        card.appendChild(info);
        card.appendChild(voteBtn);
        candidatesList.appendChild(card);
    });
}

// --- Voting Logic ---
function handleVote(candidateId) {
    if (getVotedCandidateId()) return;
    setVotedCandidateId(candidateId);
    const votes = getVotes();
    votes[candidateId] = (votes[candidateId] || 0) + 1;
    setVotes(votes);
    renderCandidates();
    updateChart();
}

// --- Chart.js Setup ---
let chart;
function updateChart() {
    const votes = getVotes();
    const data = candidates.map(c => votes[c.id] || 0);
    if (!chart) {
        chart = new window.Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: candidates.map(c => c.name),
                datasets: [{
                    label: 'Votes',
                    data,
                    backgroundColor: ['#3a8bfd', '#ffb347', '#6ee7b7'],
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, precision: 0 }
                }
            }
        });
    } else {
        chart.data.datasets[0].data = data;
        chart.update();
    }
}

// --- Admin Reset ---
adminResetBtn.onclick = function() {
    if (confirm('Are you sure you want to reset all votes?')) {
        clearVote();
        clearVotes();
        renderCandidates();
        updateChart();
    }
};

// --- Init ---
function loadChartJsAndInit() {
    if (window.Chart) {
        renderCandidates();
        updateChart();
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
        renderCandidates();
        updateChart();
    };
    document.body.appendChild(script);
}

document.addEventListener('DOMContentLoaded', loadChartJsAndInit); 