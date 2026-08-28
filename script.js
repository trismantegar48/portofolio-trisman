// === 1. KURSOR KUSTOM ===
const cursor = document.getElementById("custom-cursor");
let firstMove = true; // Penanda untuk pergerakan pertama

window.addEventListener("mousemove", (e) => {
    if (firstMove) {
        // 1. Matikan efek transisi sementara agar kursor tidak "terbang"
        cursor.style.transition = "none";
        
        // 2. Langsung pindahkan (snap) kursor secara instan ke posisi mouse
        cursor.style.transform = `translate(${e.clientX - 15}px, ${e.clientY - 15}px)`;
        
        // 3. Nyalakan kembali transisinya, lalu munculkan kursornya
        setTimeout(() => {
            cursor.style.transition = "transform 0.08s ease-out, opacity 0.3s ease";
            cursor.style.opacity = "1";
        }, 10);
        
        firstMove = false; // Matikan penanda agar kode ini tidak diulang terus
    } else {
        // Pergerakan mouse selanjutnya berjalan normal dengan animasi
        cursor.style.transform = `translate(${e.clientX - 15}px, ${e.clientY - 15}px)`;
        cursor.style.opacity = "1";
    }
});

// Sembunyikan kursor saat mouse keluar layar, dan reset penandanya
window.addEventListener("mouseout", () => {
    cursor.style.opacity = "0";
    firstMove = true; // Reset agar saat masuk layar lagi tidak terbang dari pojok
});

// === 2. EFEK MENGETIK WELCOME SCREEN ===
const text1 = "Welcome to my";
const text2 = "Portfolio Website"; 
const typingElement = document.getElementById("typing-text");
let charIndex1 = 0;
let charIndex2 = 0;
let typingSpeed = 70; 

function typeWriter() {
    if (charIndex1 < text1.length) {
        typingElement.innerHTML += text1.charAt(charIndex1);
        charIndex1++;
        setTimeout(typeWriter, typingSpeed);
    } 
    else if (charIndex1 === text1.length) {
        typingElement.innerHTML += "<br><span id='blue-text' class='text-neon'></span>";
        charIndex1++; 
        setTimeout(typeWriter, typingSpeed);
    } 
    else if (charIndex2 < text2.length) {
        document.getElementById('blue-text').innerHTML += text2.charAt(charIndex2);
        charIndex2++;
        setTimeout(typeWriter, typingSpeed);
    } 
    else {
        typingElement.innerHTML += '<span class="cursor" id="welcome-cursor"></span>';
        setTimeout(() => {
            const blinkingCursor = document.getElementById("welcome-cursor");
            if (blinkingCursor) { blinkingCursor.style.display = "none"; }
        }, 1000);
    }
}
window.onload = function() { setTimeout(typeWriter, 500); };


// === 3. EFEK MENGETIK SUBTITLE (LOOPING JUNIOR PROGRAMMER & FRESH GRADUATE) ===
const subtitleTexts = ["Junior Programmer", "Fresh Graduate"];
const subtitleElement = document.getElementById("typing-subtitle");
let textArrayIndex = 0;
let charArrayIndex = 0;
let isDeleting = false;
let isSubtitleTyped = false;

function typeSubtitle() {
    const currentWord = subtitleTexts[textArrayIndex];
    
    if (isDeleting) {
        subtitleElement.innerHTML = currentWord.substring(0, charArrayIndex - 1) + "<span class='subtitle-cursor'></span>";
        charArrayIndex--;
    } else {
        subtitleElement.innerHTML = currentWord.substring(0, charArrayIndex + 1) + "<span class='subtitle-cursor'></span>";
        charArrayIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 120;

    if (!isDeleting && charArrayIndex === currentWord.length) {
        typeSpeed = 2500; 
        isDeleting = true;
    } 
    else if (isDeleting && charArrayIndex === 0) {
        isDeleting = false;
        textArrayIndex = (textArrayIndex + 1) % subtitleTexts.length; 
        typeSpeed = 500; 
    }
    setTimeout(typeSubtitle, typeSpeed);
}


// === 4. LOGIKA NAVBAR MUNCUL SAAT DI SCROLL & HIGHLIGHT MENU ===
const navbar = document.getElementById("navbar");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    // Munculkan navbar jika sudah lewat halaman awal
    if (window.scrollY > window.innerHeight * 0.7) {
        navbar.classList.remove('nav-hidden');
        navbar.classList.add('nav-visible');
    } else {
        navbar.classList.remove('nav-visible');
        navbar.classList.add('nav-hidden');
    }

    // Ubah warna menu
    let current = "";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute("id");
        }
    });

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
        current = sections[sections.length - 1].getAttribute("id"); 
    }

    navLinks.forEach((a) => {
        a.classList.remove("active");
        if (a.getAttribute("href") === `#${current}`) {
            a.classList.add("active");
        }
    });
});


// === 5. ANIMASI ELEMEN MUNCUL & PEMICU NGETIK ===
const observerOptions = {
    root: null,
    rootMargin: '0px 0px 300px 0px', // KUNCI PERBAIKAN: Diperbesar ke 300px agar sensor lebih sensitif
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Efek Elemen Muncul (Gambar, teks deskripsi, tombol)
        if (entry.isIntersecting && entry.target.classList.contains('hidden-el')) {
            entry.target.classList.add('show-el');
        }
        
        // PERBAIKAN: Pemicu animasi mengetik kita pisahkan agar pasti tereksekusi
        if (entry.isIntersecting && entry.target.id === 'typing-subtitle') {
            if (!isSubtitleTyped) {
                isSubtitleTyped = true;
                setTimeout(typeSubtitle, 400);
            }
        }
    });
}, observerOptions);

// Daftarkan semua elemen yang akan dianimasikan
document.querySelectorAll('.hidden-el').forEach((el) => observer.observe(el));
observer.observe(document.getElementById("typing-subtitle"));

// === 6. INTERAKSI ACCORDION HALAMAN EDUCATION ===
const eduHeaders = document.querySelectorAll('.edu-header');

eduHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const body = item.querySelector('.edu-body');
        
        // Menambah/menghilangkan tanda aktif
        item.classList.toggle('active');
        
        // Efek meluncur membuka dan menutup daftar
        if (item.classList.contains('active')) {
            body.style.maxHeight = body.scrollHeight + "px";
        } else {
            body.style.maxHeight = "0px";
        }
    });
});

// === 7. LOGIKA SWAP KARTU WORKING (HANYA BERFUNGSI SAAT TOMBOL DIKLIK) ===
const workToggleBtn = document.querySelector('.work-toggle'); // Target khusus tombol
const closeGalleryBtn = document.querySelector('.close-gallery-btn');
const workCard = document.getElementById('work-card');

// Saat tombol "Lihat Galeri" diklik, tampilkan galeri
if(workToggleBtn) {
    workToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Mencegah salah klik
        workCard.classList.add('show-gallery');
    });
}

// Saat tombol 'Kembali' diklik, sembunyikan galeri dan kembalikan teks
if(closeGalleryBtn) {
    closeGalleryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        workCard.classList.remove('show-gallery');
    });
}


// === 8. LOGIKA MODAL POP-UP UNTUK MEMPERBESAR FOTO ===
const imageModal = document.getElementById("image-modal");
const expandedImg = document.getElementById("expanded-img");
const closeModalBtn = document.querySelector(".close-modal");
const galleryImages = document.querySelectorAll(".work-gallery img");

// Membuka Pop-up Gambar
galleryImages.forEach(img => {
    img.addEventListener("click", function(e) {
        e.stopPropagation(); // Mencegah kartu tertutup saat gambar ditekan
        imageModal.classList.add("show-modal");
        expandedImg.src = this.src;
    });
});

// Menutup Pop-up dengan Tanda "X"
closeModalBtn.addEventListener("click", () => {
    imageModal.classList.remove("show-modal");
});

// Menutup Pop-up jika area kosong di sekitar gambar ditekan
imageModal.addEventListener("click", (e) => {
    if (e.target === imageModal) {
        imageModal.classList.remove("show-modal");
    }
});

// === 9. LOGIKA TAMPILKAN LEBIH BANYAK PRESTASI ===
const showMoreBtn = document.getElementById('show-more-certs-btn');
const achieveGrid = document.querySelector('.achieve-grid');

if(showMoreBtn && achieveGrid) {
    showMoreBtn.addEventListener('click', () => {
        achieveGrid.classList.toggle('show-all');
        
        // Ubah teks tombol sesuai kondisi
        if(achieveGrid.classList.contains('show-all')) {
            showMoreBtn.innerHTML = 'Sembunyikan Sebagian ▲';
        } else {
            showMoreBtn.innerHTML = 'Lihat Lebih Banyak Sertifikasi ▼';
            // Kembalikan layar ke bagian atas achievement agar tidak kehilangan fokus
            document.getElementById('achievement').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// === 10. TAMBAHAN POP-UP UNTUK SELURUH KARTU ACHIEVEMENT ===
// Mengambil semua elemen kartu achievement
const achieveCards = document.querySelectorAll(".achieve-card");

achieveCards.forEach(card => {
    card.addEventListener("click", function() {
        // Cari elemen gambar (.cert-img) yang ada TEPAT DI DALAM kartu yang sedang diklik
        const certImage = this.querySelector(".cert-img");
        
        // Jika gambarnya ditemukan, tampilkan modal pop-up dan ubah sumber gambarnya
        if (certImage) {
            imageModal.classList.add("show-modal");
            expandedImg.src = certImage.src;
        }
    });
});

// === 11. LOGIKA INTERAKSI TAB PORTFOLIO SHOWCASE (DIPERKUAT ANTI-LONCAT) ===
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.portfolio-content-panel');

tabButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault(); // Mencegah lompat halaman saat tab diklik
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        button.classList.add('active');
        
        const targetId = button.getAttribute('data-target');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    });
});

// === 12. LOGIKA POP-UP GAMBAR UNTUK SERTIFIKAT DI PORTFOLIO ===
const portoCertCards = document.querySelectorAll("#portofolio .achieve-card");

portoCertCards.forEach(card => {
    card.addEventListener("click", function(e) {
        // Mencegah efek klik tembus atau lompat
        e.stopPropagation();
        const certImg = this.querySelector(".cert-img");
        if (certImg && typeof imageModal !== 'undefined' && typeof expandedImg !== 'undefined') {
            imageModal.classList.add("show-modal");
            expandedImg.src = certImg.src;
        }
    });
});

// === 13. LOGIKA TOMBOL 'LIHAT LEBIH BANYAK' KHUSUS PORTFOLIO CERTIFICATES ===
const showMorePortoBtn = document.getElementById('show-more-porto-certs-btn');
const portoAchieveGrid = document.querySelector('.porto-achieve-grid');

if(showMorePortoBtn && portoAchieveGrid) {
    showMorePortoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        portoAchieveGrid.classList.toggle('show-all-porto');
        
        if(portoAchieveGrid.classList.contains('show-all-porto')) {
            showMorePortoBtn.innerHTML = 'Sembunyikan Sebagian ▲';
        } else {
            showMorePortoBtn.innerHTML = 'Lihat Lebih Banyak Sertifikasi ▼';
            
            // KUNCI PERBAIKAN: Scroll santai ke seluruh blok '#portofolio'
            const targetSection = document.getElementById('portofolio');
            if(targetSection) {
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        }
    });
}

// === 14. LOGIKA TOMBOL 'LIHAT LEBIH BANYAK' KHUSUS HALAMAN ACHIEVEMENT UTAMA ===
const showMoreAchieveBtn = document.getElementById('show-more-achieve-btn');
const mainAchieveGrid = document.querySelector('#achievement .achieve-grid');

if(showMoreAchieveBtn && mainAchieveGrid) {
    showMoreAchieveBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        
        mainAchieveGrid.classList.toggle('show-all');
        
        if(mainAchieveGrid.classList.contains('show-all')) {
            showMoreAchieveBtn.innerHTML = 'Sembunyikan Sebagian ▲';
        } else {
            showMoreAchieveBtn.innerHTML = 'Lihat Lebih Banyak Prestasi ▼';
            
            // KUNCI PERBAIKAN: Scroll santai ke seluruh blok '#achievement'
            const targetSection = document.getElementById('achievement');
            if(targetSection) {
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        }
    });
}

// === 15. LOGIKA TOMBOL 'LIHAT LEBIH BANYAK' KHUSUS PROJECT ===
const showMoreProjectsBtn = document.getElementById('show-more-projects-btn');
const projectGrid = document.querySelector('.porto-project-grid');

if(showMoreProjectsBtn && projectGrid) {
    showMoreProjectsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        projectGrid.classList.toggle('show-all-projects');
        
        if(projectGrid.classList.contains('show-all-projects')) {
            showMoreProjectsBtn.innerHTML = 'Sembunyikan Sebagian ▲';
        } else {
            showMoreProjectsBtn.innerHTML = 'Lihat Lebih Banyak Project ▼';
            
            // KUNCI PERBAIKAN: Scroll santai ke seluruh blok '#portofolio'
            const targetSection = document.getElementById('portofolio');
            if(targetSection) {
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        }
    });
}

// === 16. LOGIKA POP-UP GAMBAR UNTUK KARTU PROJECT ===
const projectCards = document.querySelectorAll('.project-card');
const globalImageModal = document.getElementById("image-modal");
const globalExpandedImg = document.getElementById("expanded-img");

projectCards.forEach(card => {
    card.addEventListener('click', function(e) {
        // PENTING: Jangan buka gambar jika yang diklik adalah tombol "View Details" atau "Code"
        if (e.target.closest('.btn-view-details') || e.target.closest('.btn-code') || e.target.closest('.btn-pdf')) {
            return;
        }
        
        // Cari gambar yang ada di dalam kartu yang sedang diklik
        const projImg = this.querySelector('.project-img');
        
        // Tampilkan pop-up gambar (menggunakan modal yang sama dengan sertifikat)
        if (projImg && globalImageModal && globalExpandedImg) {
            globalImageModal.classList.add('show-modal');
            globalExpandedImg.src = projImg.src;
        }
    });
});

// === 17. LOGIKA NAVIGASI GESER GALERI (WORKING EXPERIENCE) ===
const leftNavBtn = document.querySelector('.left-nav');
const rightNavBtn = document.querySelector('.right-nav');
const galleryContainer = document.getElementById('working-gallery-container');

if (leftNavBtn && rightNavBtn && galleryContainer) {
    // Geser 420px (400px lebar gambar + 20px gap antar gambar)
    const scrollAmount = 420;

    leftNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        galleryContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    rightNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        galleryContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
}

// === 19. LOGIKA BINTANG JATUH (BACKGROUND) ===
const starsContainer = document.getElementById('stars-container');

if (starsContainer) {
    const numStars = 75; // Anda bisa menambah/mengurangi jumlah bintang di sini
    
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('falling-star');
        
        // Ukuran bintang diacak antara 1px hingga 3px
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Posisi horizontal diacak memenuhi lebar layar
        star.style.left = `${Math.random() * 100}vw`;
        
        // Durasi jatuh diacak antara 5 sampai 15 detik agar tidak bersamaan
        star.style.animationDuration = `${Math.random() * 10 + 5}s`;
        
        // Jeda waktu sebelum jatuh diacak
        star.style.animationDelay = `${Math.random() * 10}s`;
        
        starsContainer.appendChild(star);
    }
}

// === 18. LOGIKA MODAL VIEW DETAILS PROJECT & CAROUSEL (5 FOTO) ===
const projectsDetailsData = [
    {
        // PROJECT 1
        title: "Sarfarez Rent Car - 2023",
        github: "https://github.com/trismantegar48/FinalProject-PemrogramanWeb.git",
        desc: "Sarfarez Rent Car merupakan aplikasi berbasis web yang dikembangkan menggunakan PHP Laravel untuk memudahkan proses penyewaan dan pengelolaan kendaraan secara digital. Sistem ini menyediakan fitur informasi kendaraan, ketersediaan mobil, harga sewa, serta pengelolaan data pemesanan dan rental dengan dukungan MySQL sebagai database.",
        images: [
            "assets/img/projects/rentalmobil/rental1.png",
            "assets/img/projects/rentalmobil/rental2.png",
            "assets/img/projects/rentalmobil/rental3.png",
            "assets/img/projects/rentalmobil/rental4.png",
            "assets/img/projects/rentalmobil/rental5.png",
            "assets/img/projects/rentalmobil/rental6.png"
        ],
        techs: [
            { name: "PHP", bg: "#777bb4" },
            { name: "MySQL", bg: "#00758f" },
            { name: "Bootstrap", bg: "#7952b3" },
            { name: "HTML", bg: "#e34f26" },
            { name: "CSS", bg: "#1572b6" },
            { name: "JavaScript", bg: "#f7df1e", color: "#000" }
        ]
    },
    {
        // PROJECT 2
        title: "IManQu (Insan Membaca Quran) - 2024",
        github: "https://github.com/trismantegar48/ProjectAkhir_PMC_ImanQu.git",
        desc: "ImanQu (Insan Menghafal Quran) merupakan aplikasi berbasis mobile menggunakan bahasa pemrograman Java yang dirancang sebagai solusi inovatif untuk membantu umat Muslim dalam menghafal Al-Quran dengan lebih mudah dan efektif",
        images: [
            "assets/img/projects/imanqu/imanqu1.png",
            "assets/img/projects/imanqu/imanqu2.png",
            "assets/img/projects/imanqu/imanqu3.png",
            "assets/img/projects/imanqu/imanqu4.png",
            "assets/img/projects/imanqu/imanqu5.png",
            "assets/img/projects/imanqu/imanqu6.png"
        ],
        techs: [
            { name: "Java", bg: "#f89820" },
            { name: "Android Studio", bg: "#3ddc84", color: "#000" }
        ]
    },
    {
        // PROJECT 3
        title: "Website Manajemen Kepegawaian - 2024",
        github: "https://github.com/trismantegar48/FinalProject_WebLanjutanA-2024.git",
        desc: "Aplikasi ini dirancang untuk memberikan solusi yang komprehensif dalam pengelolaan berbagai aspek kepegawaian, mulai dari manajemen absensi, cuti, hingga evaluasi kinerja. Dikembangkan menggunakan Flask sebagai framework backend dan React JS sebagai library frontend",
        images: [
            "assets/img/projects/pegawai/pegawai1.png",
            "assets/img/projects/pegawai/pegawai2.png",
            "assets/img/projects/pegawai/pegawai3.png",
            "assets/img/projects/pegawai/pegawai4.png",
            "assets/img/projects/pegawai/pegawai5.png",
            "assets/img/projects/pegawai/pegawai6.png",
            "assets/img/projects/pegawai/pegawai7.png",
            "assets/img/projects/pegawai/pegawai8.png",
            "assets/img/projects/pegawai/pegawai9.png",
            "assets/img/projects/pegawai/pegawai10.png",
            "assets/img/projects/pegawai/pegawai11.png",
            "assets/img/projects/pegawai/pegawai12.png",
            "assets/img/projects/pegawai/pegawai13.png"
        ],
        techs: [
            { name: "ReactJS", bg: "#61dafb", color: "#000" }, 
            { name: "Flask", bg: "#000000" }, 
            { name: "Python", bg: "#3776ab" }, 
            { name: "MySQL", bg: "#00758f" } 
        ]
    },
    {
        // PROJECT 4 (MENGGUNAKAN PDF)
        title: "TrashSorter - Organic and Anorganic Waste Classification - 2024",
        github: "https://github.com/trismantegar48/Trashorter_Kelompok14.git",
        pdf: "assets/img/projects/trashorter/trashorter2.pdf",
        embedPdf: "assets/img/projects/trashorter/trashorter2.pdf",
        desc: "Proyek klasifikasi sampah organik dan anorganik menggunakan model Deep Learning (VGG16 dan ResNet) untuk mengidentifikasi dan memisahkan jenis sampah secara otomatis di lingkungan Universitas Hasanuddin. ",
        images: [], // KUNCI: Harus kosong agar PDF muncul
        techs: [
            { name: "Python", bg: "#3776ab" },
            { name: "Deep Learning", bg: "#52c4ff", color: "#000" },
            { name: "Jupyter Notebook", bg: "#f37626" }
        ]
    },
    {
        // PROJECT 5
        title: "Makkitaki (Mari Kita Kenali Kelurahan Watang Bacukiki) - 2025",
        github: "https://github.com/trismantegar48/makkitakiweb.git",
        desc: "Website MAKKITAKI merupakan platform digital yang menyediakan informasi profil Kelurahan Watang Bacukiki, meliputi sejarah, kondisi geografis, struktur pemerintahan, serta potensi wilayah dan UMKM.",
        images: [
            "assets/img/projects/wtb/wtb1.png",
            "assets/img/projects/wtb/wtb2.png",
            "assets/img/projects/wtb/wtb3.png",
            "assets/img/projects/wtb/wtb4.png",
            "assets/img/projects/wtb/wtb5.png",
            "assets/img/projects/wtb/wtb6.png"
        ],
        techs: [
            { name: "HTML", bg: "#e34f26" },
            { name: "CSS", bg: "#1572b6" },
            { name: "JavaScript", bg: "#f7df1e", color: "#000" }
        ]
    },
    {
        // PROJECT 6 (GAMBAR DI CAROUSEL, PDF HANYA DI TOMBOL)
        title: "Barru Stunting Prediction - 2026",
        github: "https://github.com/trismantegar48/barrustunting_prediciton.git",
        pdf: "assets/img/projects/stunting/stunting7.pdf", 
        desc: "Pengembangan Dashboard Sistem Informasi Prediksi Risiko Stunting Balita Menggunakan Algoritma LSTM Berdasarkan Data Time Series Pertumbuhan Balita di Kabupaten Barru Tahun 2021-2025.",
        images: [ 
            "assets/img/projects/stunting/stunting1.png",
            "assets/img/projects/stunting/stunting2.png",
            "assets/img/projects/stunting/stunting3.png",
            "assets/img/projects/stunting/stunting4.png",
            "assets/img/projects/stunting/stunting5.png",
            "assets/img/projects/stunting/stunting6.png"
        ], 
        techs: [
            { name: "Python", bg: "#3776ab" },
            { name: "Deep Learning", bg: "#52c4ff", color: "#000" },
            { name: "LSTM", bg: "#ff4757" },
            { name: "Streamlit", bg: "#ff4b4b" },
            { name: "Jupyter Notebook", bg: "#f37626" },
            { name: "Pandas", bg: "#150458" }
        ]
    }
];

const detailsBtns = document.querySelectorAll('.btn-view-details');
const projectModal = document.getElementById('project-modal');
const closeProjectModal = document.querySelector('.close-project-modal');
const modalWinTitle = document.getElementById('modal-win-title');
const modalDescText = document.getElementById('modal-desc-text');
const modalGithubBtn = document.getElementById('modal-github-btn');
const modalPdfBtn = document.getElementById('modal-pdf-btn');
const carouselTrack = document.getElementById('carousel-track');
const modalTechContainer = document.getElementById('modal-tech-container');
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');

let currentSlideIndex = 0;

detailsBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const index = this.getAttribute('data-index');
        const data = projectsDetailsData[index];
        
        if (!data) return;
        
        // Masukkan Judul & Deskripsi (Bahasa Indonesia)
        modalWinTitle.textContent = data.title;
        modalDescText.textContent = data.desc;
        modalGithubBtn.href = data.github;

        // --- LOGIKA PDF INI ---
        if (data.pdf) {
            modalPdfBtn.href = data.pdf;
            modalPdfBtn.style.display = 'inline-flex'; // Munculkan tombol merah
        } else {
            modalPdfBtn.style.display = 'none'; // Sembunyikan jika tidak ada PDF
        }
        
        // Render Gambar atau PDF ke Carousel
        carouselTrack.innerHTML = '';
        
        // JIKA PROYEK MENGGUNAKAN PDF (Tidak ada gambar)
        if (data.embedPdf && (!data.images || data.images.length === 0)) {
            const iframe = document.createElement('iframe');
            iframe.src = data.embedPdf;
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "none";
            carouselTrack.appendChild(iframe);
            
            // Sembunyikan tombol panah karena PDF bisa di-scroll ke bawah
            if (carouselPrev) carouselPrev.style.display = 'none';
            if (carouselNext) carouselNext.style.display = 'none';
        } 
        // JIKA PROYEK MENGGUNAKAN GAMBAR
        else {
            data.images.forEach(imgSrc => {
                const img = document.createElement('img');
                img.src = imgSrc;
                img.classList.add('carousel-slide-img');
                carouselTrack.appendChild(img);
            });
            
            // Munculkan kembali tombol panah
            if (carouselPrev) carouselPrev.style.display = 'flex';
            if (carouselNext) carouselNext.style.display = 'flex';
        }
        
        currentSlideIndex = 0;
        updateCarouselPosition();
        
        // Render Teknologi Utama dengan Warna Menarik
        modalTechContainer.innerHTML = '';
        data.techs.forEach(tech => {
            const pill = document.createElement('span');
            pill.classList.add('tech-badge-pill');
            pill.textContent = tech.name;
            pill.style.backgroundColor = tech.bg;
            if (tech.color) pill.style.color = tech.color;
            modalTechContainer.appendChild(pill);
        });
        
        // Tampilkan Modal
        projectModal.classList.add('show-modal');
    });
});

// Kontrol Tombol Geser Carousel (< >)
if (carouselPrev && carouselNext) { 
    carouselPrev.addEventListener('click', () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateCarouselPosition();
        }
    });

    carouselNext.addEventListener('click', () => {
        const totalSlides = carouselTrack.children.length;
        if (currentSlideIndex < totalSlides - 1) {
            currentSlideIndex++;
            updateCarouselPosition();
        }
    });
}

function updateCarouselPosition() {
    const slideWidth = carouselTrack.clientWidth;
    carouselTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
}

// Menutup Modal Proyek
if (closeProjectModal) {
    closeProjectModal.addEventListener('click', () => {
        projectModal.classList.remove('show-modal');
    });
}

if (projectModal) {
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.classList.remove('show-modal');
        }
    });
}

// === 20. LOGIKA SLIDESHOW FOTO DALAM HP 3D (HALAMAN CONTACT) ===
const phoneSlides = document.querySelectorAll('.phone-slide');

if (phoneSlides.length > 0) {
    let currentPhoneSlide = 0;
    
    setInterval(() => {
        // Hilangkan kelas active dari foto saat ini
        phoneSlides[currentPhoneSlide].classList.remove('active');
        
        // Geser ke foto berikutnya (kembali ke 0 jika sudah habis)
        currentPhoneSlide = (currentPhoneSlide + 1) % phoneSlides.length;
        
        // Tambahkan kelas active ke foto baru
        phoneSlides[currentPhoneSlide].classList.add('active');
    }, 3500); // 3500 ms = 3,5 detik pergantian foto
}

// === 21. LOGIKA KARTU ABOUT MENGARAH LANGSUNG KE TAB PORTOFOLIO ===
const linkAboutProjects = document.getElementById('link-about-projects');
const linkAboutCerts = document.getElementById('link-about-certs');

// Fungsi untuk secara otomatis mengklik tombol tab yang sesuai
function switchToTab(targetTabId) {
    const targetBtn = document.querySelector(`.tab-btn[data-target="${targetTabId}"]`);
    if (targetBtn) {
        targetBtn.click(); // Memicu klik pada tab secara otomatis
    }
}

// Jika kartu Projects ditekan, buka tab Projects
if (linkAboutProjects) {
    linkAboutProjects.addEventListener('click', () => {
        switchToTab('projects-tab');
    });
}

// Jika kartu Certificates ditekan, buka tab Certificates
if (linkAboutCerts) {
    linkAboutCerts.addEventListener('click', () => {
        switchToTab('certificates-tab');
    });
}