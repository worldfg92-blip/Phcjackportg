/* =====================================================
   PHC GLOBAL APP FUNCTIONS (CONNECTED TO SUPABASE)
===================================================== */

// ==========================================================
// 1. SUPABASE CONFIG (YOUR EXACT KEYS)
// ==========================================================
const SUPABASE_URL = "https://gcesrhfyupmkrevaqpfr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZXNyaGZ5dXBta3JldmFxcGZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MjQ0MjAsImV4cCI6MjA5ODQwMDQyMH0.LarBYjP0Eg4HfFV_x5GVS7K1d4AuRfBWOjo0D1kL2xM";

// ==========================================================
// 2. PAGE NAVIGATION
// ==========================================================
function go(page) {
    window.location.href = page;
}

// ==========================================================
// 3. BACK BUTTON
// ==========================================================
function goBack() {
    window.history.back();
}

// ==========================================================
// 4. DARK MODE SYSTEM (GLOBAL TOGGLE)
// ==========================================================
function enableDarkMode() {
    let saved = localStorage.getItem("phc_dark_mode");
    if (saved === "true") {
        document.body.classList.add("dark");
    }
}

function toggleDarkModeGlobal() {
    document.body.classList.toggle("dark");
    localStorage.setItem(
        "phc_dark_mode",
        document.body.classList.contains("dark")
    );
    // Show feedback
    const isDark = document.body.classList.contains("dark");
    if (isDark) {
        showToast("🌙 Dark mode enabled globally");
    } else {
        showToast("☀️ Light mode enabled globally");
    }
}

// ==========================================================
// 5. TOAST NOTIFICATION
// ==========================================================
function showToast(msg, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) {
        // If no toast element, fallback to alert
        alert(msg);
        return;
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ==========================================================
// 6. LOGOUT
// ==========================================================
function logoutUser() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("phc_current_user");
        showToast("👋 Logged out successfully!");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 800);
    }
}

// ==========================================================
// 7. PROFILE NAVIGATION
// ==========================================================
function openProfile() {
    go("profile.html");
}

// ==========================================================
// 8. FORMAT CURRENCY
// ==========================================================
function formatCurrency(val) {
    return val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ==========================================================
// 9. GAME COUNTER (UNTOUCHED)
// ==========================================================
function startCounter() {
    let endTime = localStorage.getItem("phc_end_time");
    
    if (!endTime) {
        endTime = new Date().getTime() + (5 * 24 * 60 * 60 * 1000);
        localStorage.setItem("phc_end_time", endTime);
    }
    
    setInterval(() => {
        let now = new Date().getTime();
        let distance = endTime - now;
        
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        let d = document.getElementById("days");
        if (d) {
            d.innerHTML = days;
            document.getElementById("hours").innerHTML = hours;
            document.getElementById("minutes").innerHTML = minutes;
            document.getElementById("seconds").innerHTML = seconds;
        }
    }, 1000);
}

// ==========================================================
// 10. GET LOGGED IN USER FROM CLOUD
// ==========================================================
async function getCurrentUser() {
    const localUser = JSON.parse(localStorage.getItem('phc_current_user'));
    if (!localUser || !localUser.email) return null;
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${localUser.email}&select=*`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data[0] || null;
}

// ==========================================================
// 11. GET CLOUD TRANSACTIONS
// ==========================================================
async function getTransactions() {
    const user = await getCurrentUser();
    if (!user) return [];
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions?user_email=eq.${user.email}&order=created_at.desc`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });
    if (!response.ok) return [];
    return await response.json();
}

// ==========================================================
// 12. START APP
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
    enableDarkMode();
    startCounter();
});

console.log('✅ PHC Global App loaded successfully!');