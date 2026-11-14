const CONFIG = {
    name: "Medina Ayu Prameswari",
    nickname: "my sweaties rollade",
    birthday: "26 November 2026",
    password: "12102x2087",
    canvaUrl: "PASTE_CANVA_LINK_HERE" // Ganti nanti dengan link Canva kamu
};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".nickname-text").forEach(el => {
        el.textContent = CONFIG.nickname;
    });

    // Floating Hearts
    const heartsContainer = document.getElementById("hearts-container");
    const heartSymbols = ["💗", "💖", "🤍", "❤️"];

    function createHeart() {
        const heart = document.createElement("div");
        heart.classList.add("floating-heart");
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.fontSize = (Math.random() * 12 + 12) + "px";
        heart.style.animationDuration = (Math.random() * 4 + 6) + "s";
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 10000);
    }
    setInterval(createHeart, 900);

    // Audio Controller
    const bgMusic = document.getElementById("bg-music");
    const musicBtn = document.getElementById("music-toggle");
    let isPlaying = false;

    function playMusic() {
        bgMusic.volume = 0.4;
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.classList.remove("hidden");
            musicBtn.classList.add("playing");
        }).catch(() => {
            musicBtn.classList.remove("hidden");
        });
    }

    musicBtn.addEventListener("click", () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.classList.remove("playing");
            isPlaying = false;
        } else {
            bgMusic.play();
            musicBtn.classList.add("playing");
            isPlaying = true;
        }
    });

    const stageOpening = document.getElementById("stage-opening");
    const stageGift = document.getElementById("stage-gift");
    const stageJourney = document.getElementById("stage-journey");
    const stagePassword = document.getElementById("stage-password");

    document.getElementById("btn-open-gift").addEventListener("click", () => {
        playMusic();
        stageOpening.style.opacity = "0";
        setTimeout(() => {
            stageOpening.classList.add("hidden");
            stageGift.classList.remove("hidden");
            init3DBox();
        }, 500);
    });

    // ==========================================
    // 3D GIFT BOX (Besar, Berwarna, Tidak Kopong & Detail)
    // ==========================================
    let giftScene, giftCamera, giftRenderer, giftLidGroup, contentsGroup;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let boxOpened = false;

    function init3DBox() {
        const container = document.getElementById("canvas-gift-container");
        if (!container || giftRenderer) return;

        giftScene = new THREE.Scene();
        giftCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        giftCamera.position.set(0, 4.8, 7.2);
        giftCamera.lookAt(0, 0.3, 0);

        giftRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        giftRenderer.setSize(container.clientWidth, container.clientHeight);
        giftRenderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(giftRenderer.domElement);

        giftScene.add(new THREE.AmbientLight(0xffffff, 1.0));
        const pLight = new THREE.PointLight(0xffffff, 1.5);
        pLight.position.set(6, 12, 8);
        giftScene.add(pLight);
        const pLight2 = new THREE.PointLight(0xffb3c6, 1.0);
        pLight2.position.set(-6, -2, -4);
        giftScene.add(pLight2);

        const boxGroup = new THREE.Group();
        giftScene.add(boxGroup);

        // Badan Kotak dengan Dinding Tebal (Tidak Kopong)
        const outerMat = new THREE.MeshStandardMaterial({ color: 0xe63956, roughness: 0.25, side: THREE.DoubleSide });
        
        const boxBottom = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.2, 3.2), outerMat);
        boxBottom.position.y = -1.0;
        const wall1 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.0, 0.15), outerMat);
        wall1.position.set(0, 0, 1.5);
        const wall2 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.0, 0.15), outerMat);
        wall2.position.set(0, 0, -1.5);
        const wall3 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.0, 3.2), outerMat);
        wall3.position.set(1.5, 0, 0);
        const wall4 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.0, 3.2), outerMat);
        wall4.position.set(-1.5, 0, 0);

        boxGroup.add(boxBottom, wall1, wall2, wall3, wall4);

        const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        boxGroup.add(new THREE.Mesh(new THREE.BoxGeometry(3.22, 2.02, 0.4), ribbonMat));
        boxGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.02, 3.22), ribbonMat));

        // Tutup Kotak
        giftLidGroup = new THREE.Group();
        giftLidGroup.position.y = 1.25;
        boxGroup.add(giftLidGroup);

        const lidMat = new THREE.MeshStandardMaterial({ color: 0xd9829b, roughness: 0.25 });
        const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(3.35, 0.4, 3.35), lidMat);
        giftLidGroup.add(lidMesh);
        giftLidGroup.add(new THREE.Mesh(new THREE.BoxGeometry(3.38, 0.42, 0.4), ribbonMat));
        giftLidGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.42, 3.38), ribbonMat));

        // ISI KADO BERWARNA (Hacipupu, Matcha, Cokelat)
        contentsGroup = new THREE.Group();
        contentsGroup.position.set(0, -0.4, 0);
        contentsGroup.visible = false;
        boxGroup.add(contentsGroup);

        // 1. Boneka Hacipupu Pink
        const haciGroup = new THREE.Group();
        haciGroup.position.set(-0.8, 0.2, 0);
        const pinkBodyMat = new THREE.MeshStandardMaterial({ color: 0xff758c, roughness: 0.3 });
        const pinkHeadMat = new THREE.MeshStandardMaterial({ color: 0xffb3c6, roughness: 0.3 });

        const haciBody = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), pinkBodyMat);
        const haciHead = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 24), pinkHeadMat);
        haciHead.position.y = 0.55;
        
        const earL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 16), pinkHeadMat);
        earL.position.set(-0.2, 0.9, 0);
        earL.rotation.z = 0.25;
        const earR = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 16), pinkHeadMat);
        earR.position.set(0.2, 0.9, 0);
        earR.rotation.z = -0.25;

        haciGroup.add(haciBody, haciHead, earL, earR);
        contentsGroup.add(haciGroup);

        // 2. Minuman Matcha (Hijau + Tutup Putih + Sedotan)
        const matchaGroup = new THREE.Group();
        matchaGroup.position.set(0.8, 0.2, 0);
        const matchaCupMat = new THREE.MeshStandardMaterial({ color: 0x52b788, roughness: 0.25 });
        const whiteDetailMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        const strawMat = new THREE.MeshStandardMaterial({ color: 0xe63956, roughness: 0.2 });

        const matchaCup = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.85, 24), matchaCupMat);
        const matchaLid = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.12, 24), whiteDetailMat);
        matchaLid.position.y = 0.42;
        const matchaStraw = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 12), strawMat);
        matchaStraw.position.set(0.08, 0.65, 0);
        matchaStraw.rotation.z = -0.2;

        matchaGroup.add(matchaCup, matchaLid, matchaStraw);
        contentsGroup.add(matchaGroup);

        // 3. Batang Cokelat Manis
        const chocoGroup = new THREE.Group();
        chocoGroup.position.set(0, 0.1, 0.75);
        const chocoMat = new THREE.MeshStandardMaterial({ color: 0x582f0e, roughness: 0.4 });
        const wrapMat = new THREE.MeshStandardMaterial({ color: 0xffb703, roughness: 0.3 });

        const chocoBar = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.2, 0.6), chocoMat);
        const chocoWrap = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.62), wrapMat);
        chocoWrap.position.x = 0.15;

        chocoGroup.add(chocoBar, chocoWrap);
        contentsGroup.add(chocoGroup);

        // Kontrol Rotasi 360 Derajat
        container.addEventListener("pointerdown", (e) => {
            isDragging = true;
            prevMouse = { x: e.clientX, y: e.clientY };
        });
        window.addEventListener("pointermove", (e) => {
            if (!isDragging) return;
            boxGroup.rotation.y += (e.clientX - prevMouse.x) * 0.012;
            boxGroup.rotation.x += (e.clientY - prevMouse.y) * 0.012;
            prevMouse = { x: e.clientX, y: e.clientY };
        });
        window.addEventListener("pointerup", () => isDragging = false);

        // Klik Membuka Kotak
        container.addEventListener("click", () => {
            if (boxOpened) return;
            boxOpened = true;

            let progress = 0;
            const openInterval = setInterval(() => {
                progress += 0.05;
                giftLidGroup.position.y += 0.15;
                giftLidGroup.position.z -= 0.1;
                giftLidGroup.rotation.x -= 0.12;

                contentsGroup.visible = true;
                if (contentsGroup.position.y < 1.1) {
                    contentsGroup.position.y += 0.07;
                }

                if (progress >= 1) clearInterval(openInterval);
            }, 30);

            confetti({
                particleCount: 120,
                spread: 85,
                origin: { y: 0.6 },
                colors: ["#ff758c", "#ffb3c6", "#ffffff", "#52b788", "#ffb703"]
            });

            document.getElementById("gift-hint").classList.add("hidden");
            document.getElementById("gift-reveal-text").classList.remove("hidden");

            setTimeout(() => {
                stageGift.style.opacity = "0";
                setTimeout(() => {
                    stageGift.classList.add("hidden");
                    stageJourney.classList.remove("hidden");
                    window.scrollTo(0, 0);
                    triggerScrollReveal();
                }, 600);
            }, 3200);
        });

        function animate() {
            requestAnimationFrame(animate);
            if (!isDragging && !boxOpened) {
                boxGroup.rotation.y += 0.006;
            }
            giftRenderer.render(giftScene, giftCamera);
        }
        animate();
    }

    // ==========================================
    // 3D ROTATABLE LOVE LETTER
    // ==========================================
    let envScene, envCamera, envRenderer;
    let envDragging = false;
    let envPrevMouse = { x: 0, y: 0 };
    let envelopeOpened = false;

    function init3DEnvelope() {
        const container = document.getElementById("canvas-envelope-container");
        if (!container || envRenderer) return;

        envScene = new THREE.Scene();
        envCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        envCamera.position.set(0, 0, 5);

        envRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        envRenderer.setSize(container.clientWidth, container.clientHeight);
        envRenderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(envRenderer.domElement);

        envScene.add(new THREE.AmbientLight(0xffffff, 0.9));
        const light = new THREE.PointLight(0xffffff, 1.2);
        light.position.set(2, 3, 4);
        envScene.add(light);

        const envGroup = new THREE.Group();
        envScene.add(envGroup);

        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf8ad9d, roughness: 0.4 });
        const envelopeBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.5, 0.08), bodyMat);
        envGroup.add(envelopeBody);

        const flapShape = new THREE.Shape();
        flapShape.moveTo(-1.2, 0);
        flapShape.lineTo(1.2, 0);
        flapShape.lineTo(0, -0.8);
        flapShape.closePath();

        const extrudeSettings = { depth: 0.04, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
        const flapGeo = new THREE.ExtrudeGeometry(flapShape, extrudeSettings);
        const flapMat = new THREE.MeshStandardMaterial({ color: 0xf4978e, roughness: 0.4 });
        const flapMesh = new THREE.Mesh(flapGeo, flapMat);
        flapMesh.position.set(0, 0.75, 0.04);
        envGroup.add(flapMesh);

        const heartMat = new THREE.MeshStandardMaterial({ color: 0xe63956 });
        const heartMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.12), heartMat);
        heartMesh.position.set(0, -0.1, 0.06);
        envGroup.add(heartMesh);

        container.addEventListener("pointerdown", (e) => {
            envDragging = true;
            envPrevMouse = { x: e.clientX, y: e.clientY };
        });
        window.addEventListener("pointermove", (e) => {
            if (!envDragging) return;
            envGroup.rotation.y += (e.clientX - envPrevMouse.x) * 0.01;
            envGroup.rotation.x += (e.clientY - envPrevMouse.y) * 0.01;
            envPrevMouse = { x: e.clientX, y: e.clientY };
        });
        window.addEventListener("pointerup", () => envDragging = false);

        container.addEventListener("click", () => {
            if (envelopeOpened) return;
            openLoveLetter();
        });

        function animateEnv() {
            requestAnimationFrame(animateEnv);
            if (!envDragging && !envelopeOpened) envGroup.rotation.y += 0.007;
            envRenderer.render(envScene, envCamera);
        }
        animateEnv();
    }

    const envelopeWrapper = document.getElementById("envelope-wrapper");
    const letterPaper = document.getElementById("letter-paper");
    const btnOpenLetter = document.getElementById("btn-open-letter");

    function openLoveLetter() {
        if (envelopeOpened) return;
        envelopeOpened = true;

        envelopeWrapper.style.opacity = "0";
        setTimeout(() => {
            envelopeWrapper.classList.add("hidden");
            letterPaper.classList.remove("hidden");
            const paragraphs = letterPaper.querySelectorAll("p");
            paragraphs.forEach((p, index) => {
                p.style.animationDelay = `${index * 0.25}s`;
            });
        }, 500);
    }

    btnOpenLetter.addEventListener("click", openLoveLetter);

    function triggerScrollReveal() {
        const reveals = document.querySelectorAll(".reveal");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    if (entry.target.querySelector("#canvas-envelope-container") && !envRenderer) {
                        init3DEnvelope();
                    }
                }
            });
        }, { threshold: 0.15 });
        reveals.forEach(el => observer.observe(el));
    }

    document.getElementById("btn-to-password").addEventListener("click", () => {
        stageJourney.classList.add("hidden");
        stagePassword.classList.remove("hidden");
        window.scrollTo(0, 0);
    });

    const passwordInput = document.getElementById("password-input");
    const passwordError = document.getElementById("password-error");
    const passwordGate = document.getElementById("password-gate");
    const passwordSuccess = document.getElementById("password-success");
    const redirectState = document.getElementById("redirect-state");

    function checkPassword() {
        const userInput = passwordInput.value.trim();
        if (userInput === CONFIG.password) {
            passwordError.classList.add("hidden");
            passwordGate.classList.add("hidden");
            passwordSuccess.classList.remove("hidden");

            confetti({
                particleCount: 110,
                spread: 80,
                origin: { y: 0.6 }
            });
        } else {
            passwordError.classList.remove("hidden");
            passwordError.style.animation = "none";
            passwordError.offsetHeight;
            passwordError.style.animation = null;
        }
    }

    document.getElementById("btn-unlock").addEventListener("click", checkPassword);
    passwordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") checkPassword();
    });

    document.getElementById("btn-final-canva").addEventListener("click", () => {
        passwordSuccess.classList.add("hidden");
        redirectState.classList.remove("hidden");

        setTimeout(() => {
            if (CONFIG.canvaUrl && CONFIG.canvaUrl !== "PASTE_CANVA_LINK_HERE") {
                window.location.href = CONFIG.canvaUrl;
            } else {
                alert("Link Canva belum diisi di script.js (bagian CONFIG.canvaUrl) 😊");
            }
        }, 2200);
    });
});