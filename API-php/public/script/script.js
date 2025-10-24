        // Mobile menu toggle
        document.getElementById('hamburger').addEventListener('click', function() {
            this.classList.toggle('active');
            document.getElementById('mobile-menu').classList.toggle('active');
        });

        // 3D Earth
        const container = document.getElementById('earth-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Create Earth - radius increased from 2 to 6
        const geometry = new THREE.SphereGeometry(6, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0x64ffda,
            wireframe: true,
            opacity: 0.35,
            transparent: true
        });
        const earth = new THREE.Mesh(geometry, material);
        scene.add(earth);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Add point light
        const pointLight = new THREE.PointLight(0x64ffda, 1);
        pointLight.position.set(5, 3, 5);
        scene.add(pointLight);

        // Adjusted camera position for larger Earth
        camera.position.z = 10;  // Increased from 5 to 15 to accommodate larger Earth

        // Animation
        function animate() {
            requestAnimationFrame(animate);
            earth.rotation.y += 0.005;
            renderer.render(scene, camera);
        }

        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }

        animate();