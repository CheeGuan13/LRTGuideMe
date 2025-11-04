// i18n.js — simple internationalization helper with optional LibreTranslate integration.

// Static translation dictionary for common UI strings. Keys correspond to data-i18n-key
// attributes in the HTML. Languages supported: en (English), ms (Malay), zh (Chinese).
const translations = {
  en: {
    // --- General ---
    welcome: 'Find your way inside the LRT station',
    tagline: 'Your smart navigation companion for LRT stations.',
    start_navigation: 'Start Navigation',
    micro_info: 'Tap to pick your current station → choose a destination inside the station.',
    popular_attractions: 'Popular Attractions Among Malaysia',
    view_details: 'View details',
    back: '← Back',
    login_btn: 'Login',

    // --- Login Page ---
    login_title: 'Login to LRT GuideMe',
    username_label: 'Username',
    password_label: 'Password',
    login_button: 'Login',
    forgot_password: 'Forgot password?',
    no_account: "Don't have an account?",
    sign_up: 'Sign up here',
    admin_login_prompt: "Login as administrator?",
    admin_login_link: "Login as Admin",

    // --- Sign Up Page ---
    signup_title: 'Create Your Account',
    email_label: 'Email',
    confirm_password_label: 'Confirm Password',
    signup_button: 'Register',
    have_account: 'Already have an account?',
    login_here: 'Login here',

    // --- User Page ---
    user_page_title: 'LRT GuideMe – User Profile',
    welcome_prefix: 'Welcome, ',
    logged_in_status: 'You are logged in to LRT GuideMe.',
    logout_button: 'Logout',
    back_to_navigation: "Back to Navigation",
    quick_links: "Quick Links",
    home_page: "Home Page",

    // --- Forgot Password Page ---
    reset_page_title: 'Reset Your Password',
    reset_instructions: 'Enter your username and the email you registered with, then set a new password.',
    new_password_label: 'New Password',
    reset_button: 'Reset Password',
    back_to_login: 'Back to Login',

    // --- Navigation Page ---
    iam_at: 'I am at:',
    station_map: 'Station Map',
    station_levels: 'Station Levels',
    ground_floor: 'Ground Floor',
    platform_level: 'Platform Level',
    navigation_type: 'Navigation Type',
    escalator_route: 'Escalator Route',
    elevator_route: 'Elevator Route',
    accessible_route: 'Accessible Route',
    facility_info: 'Facility Info',
    tap_any_dot: 'Tap any dot on the map to view its details here.',
    get_directions: 'Get Directions',
    current_station_prefix: 'Current Station: ',
    change_station: 'Change Station',
    directions: 'Directions',
    ar_demo: 'AR Demo',
    ar_view_mockup: 'AR View (Mock-up)',
    select_current_location_prompt: 'Please select your current location in the "I am at" dropdown.',
    start_not_found: 'Selected start location not found in station map.',
    cross_level_unavailable: 'Cross-level navigation is not available between these floors.',
    map_coming_soon: 'Map coming soon...',
    on_level: "on",

    // --- Station Select Page ---
    select_current_station: 'Select Current Station',
    select_line_prompt: 'Select your line, then pick your station to continue.',
    search_placeholder: 'Search stations...',
    continue_to_map: 'Continue to Map',
    line_label: 'Line',

    // --- Attraction Pages ---
    about_header: 'About',
    station_info_header: 'Station Information',
    nearest_station: 'Nearest LRT Station:',
    line_label_detail: 'Line:',
    station_code: 'Station Code:',
    interchange: 'Interchange:',
    nearby_landmarks: 'Nearby Landmarks:',
    facilities: 'Facilities:',
    navigate_in_station: 'Navigate in station',
    
    klcc_p1: 'KLCC is home to the iconic <b>Petronas Twin Towers</b>, among the tallest twin structures in the world. This landmark has become a symbol of Malaysia’s rapid development and modern cityscape.',
    klcc_p2: 'Surrounding the towers is <b>Suria KLCC</b>, a premier shopping mall offering luxury brands, diverse dining, and an excellent cinema experience. KLCC Park provides a scenic green escape with jogging paths, fountains, and a playground, making it a popular destination for both locals and tourists. Visitors can also explore <b>Aquaria KLCC</b>, one of Southeast Asia’s leading oceanariums.',
    klcc_station_p: 'KLCC Station directly connects passengers to the heart of Kuala Lumpur’s commercial district. It is designed for high accessibility, with escalators and lifts that cater to visitors of all needs. The station is strategically located underground, providing sheltered access to major attractions and seamless integration with surrounding shopping and business areas.',
    bukit_p1: 'Bukit Bintang is the beating heart of Kuala Lumpur’s “Golden Triangle”, a lively district famous for shopping, dining, and entertainment. The area is home to world-class malls such as Pavilion Kuala Lumpur, Fahrenheit88, and Lot 10, making it the city’s fashion and retail hub. At night, the streets transform with neon lights, rooftop bars, and bustling nightclubs.',
    bukit_p2: 'Just steps away lies Jalan Alor, a street food haven that attracts locals and tourists alike with its grilled seafood, satay, and tropical desserts. Whether you’re searching for luxury brands, vibrant nightlife, or authentic Malaysian flavors, Bukit Bintang offers a unique blend of modern city energy and traditional charm.',
    bukit_station_p: 'Masjid Jamek Station is one of the busiest and most important interchange stations in Kuala Lumpur. It directly connects three major LRT lines – Kelana Jaya, Sri Petaling, and Ampang – allowing seamless transfers across the city. The station is located just steps away from the mosque and other heritage landmarks, making it a convenient hub for both commuters and tourists.',
    petaling_p1: 'Petaling Street, also known as Chinatown Kuala Lumpur, is one of the city’s most iconic and historic districts. It is a lively marketplace filled with countless stalls selling everything from clothes, accessories, and souvenirs to traditional Chinese herbs and street food. Visitors can enjoy bargaining with vendors while experiencing the vibrant atmosphere that reflects the multicultural spirit of Kuala Lumpur.',
    petaling_p2: 'At night, the area transforms into a colorful bazaar, with glowing lanterns lighting up the streets and food stalls offering local delicacies such as wantan mee, claypot chicken rice, and famous herbal teas. Beyond shopping and dining, the area is also home to several temples and heritage buildings that showcase the historical importance of the Chinese community in Malaysia.',
    petaling_station_p: 'The station itself is designed for accessibility and comfort. It features escalators, elevators, and clear signages to guide travelers smoothly. Its underground layout also provides shelter from weather conditions, making it ideal for visitors who plan to explore the city on foot. Nearby facilities include food courts, convenience stores, and cultural spaces, ensuring that passengers have everything they need as soon as they step out.',
    central_market_p1: 'Central Market (Pasar Seni) is a cultural landmark in the heart of Kuala Lumpur, originally established as a wet market in the early 20th century and later transformed into a heritage centre for Malaysian arts and crafts. Today it is a vibrant hub where visitors can discover traditional batik, hand-made souvenirs, local artworks, and performances that celebrate Malaysia’s multicultural heritage.',
    central_market_p2: 'The market’s covered arcade is home to dozens of stalls and boutique shops, showcasing skilled artisans and designers. In addition to shopping, Central Market frequently hosts cultural events, craft workshops and small exhibitions that provide an authentic taste of Malaysian culture. It’s a favourite stop for visitors who want to buy locally-made keepsakes and experience the city’s artistic side.',
    central_market_station_p: 'The station itself is designed for accessibility and comfort. It features escalators, elevators, and clear signages to guide travelers smoothly. Its underground layout also provides shelter from weather conditions, making it ideal for visitors who plan to explore the city on foot. Nearby facilities include food courts, convenience stores, and cultural spaces, ensuring that passengers have everything they need as soon as they step out.',
    titiwangsa_p1: 'Titiwangsa is a popular recreational destination in Kuala Lumpur, best known for the expansive <b>Titiwangsa Lake Gardens</b>. The park offers jogging tracks, cycling paths, boating activities, and open green spaces for families to relax. It is also home to <b>Istana Budaya (National Theatre)</b> and the <b>National Art Gallery</b>, making it a cultural hub that blends nature with art and performance.',
    titiwangsa_p2: 'The area is a favorite among both locals and tourists, providing a peaceful retreat from the bustling city center while still being easily accessible by public transport.',
    titiwangsa_station_p: 'Titiwangsa Station directly connects passengers to one of Kuala Lumpur’s most vibrant recreational areas. It is designed for accessibility and convenience, with modern facilities that make traveling comfortable for all visitors. From the station, passengers can easily reach the lake gardens, cultural landmarks, and green spaces that define the Titiwangsa district.',
    bird_park_p1: 'KL Bird Park is one of the largest free-flight aviaries in the world, home to thousands of birds from around the globe. Visitors can enjoy up-close encounters with exotic species, interactive feeding sessions, and educational exhibits focused on avian conservation.',
    bird_park_p2: 'Easily accessible via LRT, KL Bird Park provides a serene escape from the city bustle while offering a fun and educational experience for families, tourists, and bird enthusiasts.',
    bird_station_p: 'The station itself is designed for accessibility and comfort. It features escalators, elevators, and clear signages to guide travelers smoothly. Its underground layout also provides shelter from weather conditions, making it ideal for visitors who plan to explore the city on foot. Nearby facilities include food courts, convenience stores, and cultural spaces, ensuring that passengers have everything they need as soon as they step out.',

    // --- Index Page Constraint ---
    login_required: 'You must be logged in to use navigation. Please login first.',

    // --- PHP Script Messages ---
    all_fields_required: 'All fields are required!',
    passwords_do_not_match: 'Passwords do not match!',
    password_too_short: 'Password must be at least 6 characters long.',
    signup_success: 'Signup successful! You can now log in.',
    signup_failed: 'Signup failed. Please try again.',
    user_exists: 'Username or email already exists!',
    login_success: 'Login successful! Welcome back.',
    login_failed_password: 'Incorrect password.',
    login_failed_username: 'Username not found.',
    reset_success: 'Password reset successful! You can now login with your new password.',
    reset_failed_update: 'Failed to update password. Please try again.',
    reset_failed_email_mismatch: 'The email address does not match the account for this username.',
    logout_success: 'You have been logged out successfully.',

    // --- Delete Account ---
    delete_account_button: 'Delete Account',
    delete_confirm_1: 'Are you sure you want to delete your account? This action cannot be undone.',
    delete_prompt_password: 'To confirm deletion, please enter your password:',
    delete_confirm_2: 'FINAL CONFIRMATION: Delete account permanently?',
    delete_cancelled: 'Account deletion cancelled.',
    delete_success: 'Your account has been successfully deleted.',
    delete_error_generic: 'An error occurred. Please try again.',
    delete_error_not_logged_in: 'You must be logged in to delete your account.',
    delete_error_password: 'Password incorrect. Account not deleted.',
    
    // --- 【【 翻译添加在这里 】】 ---
    edit_profile_title: 'LRT GuideMe – Edit Profile',
    edit_profile_button:'Edit',
    edit_profile_heading: 'Edit Your Profile',
    edit_profile_description: 'Update your username, email, or password below.',
    save_button: 'Save Changes',
    cancel_button: 'Cancel',
    alert_login_first: "Please log in first.",
    alert_load_profile_error: "Error loading profile.",
    alert_update_success: "Profile updated successfully!",
    alert_update_failed: "Update failed.",
    alert_update_error: "Error updating profile.",
    avatar_label: "Profile Picture:",
    choose_file_btn: "Choose File",
    no_file_chosen: "No file chosen",
    password_placeholder: "Leave blank to keep current password",
    danger_zone: "Danger Zone",
    danger_zone_desc: "Deleting your account is permanent and cannot be undone.",
    delete_account_button_long: "Delete This Account",
    
    // --- Admin Page ---
    welcome_admin: 'Welcome, {name}!',
    admin_dashboard_title: 'Admin Dashboard',
    logout_button_admin: 'Logout',
    admin_login_title: 'Admin Login',
    admin_login_button: 'Login as Admin',
    back_to_user_login: 'Back to user login',
    admin_username_placeholder: 'Enter admin username',
    admin_password_placeholder: 'Enter admin password',
    admin_not_found: 'Admin account not found.',
    invalid_password: 'Incorrect password.'
  },
  ms: {
    // --- General ---
    welcome: 'Cari jalan anda di dalam stesen LRT',
    tagline: 'Rakan navigasi pintar anda untuk stesen LRT.',
    start_navigation: 'Mulakan navigasi',
    micro_info: 'Ketuk untuk pilih stesen semasa anda → pilih destinasi di dalam stesen.',
    popular_attractions: 'Tarikan Popular di Malaysia',
    view_details: 'Lihat butiran',
    back: '← Balik',
    login_btn: 'Log Masuk',

    // --- Login Page ---
    login_title: 'Log Masuk ke LRT GuideMe',
    username_label: 'Nama Pengguna',
    password_label: 'Kata Laluan',
    login_button: 'Log Masuk',
    forgot_password: 'Lupa kata laluan?',
    no_account: 'Tiada akaun?',
    sign_up: 'Daftar di sini',
    admin_login_prompt: "Log masuk sebagai pentadbir?",
    admin_login_link: "Log masuk di sini",

    // --- Sign Up Page ---
    signup_title: 'Cipta Akaun Anda',
    email_label: 'E-mel',
    confirm_password_label: 'Sahkan Kata Laluan',
    signup_button: 'Daftar',
    have_account: 'Sudah mempunyai akaun?',
    login_here: 'Log masuk di sini',

    // --- User Page ---
    user_page_title: 'LRT GuideMe – Profil Pengguna',
    welcome_prefix: 'Selamat datang, ',
    logged_in_status: 'Anda telah log masuk ke LRT GuideMe.',
    logout_button: 'Log Keluar',
    back_to_navigation: "Kembali ke Navigasi",
    quick_links: "Pautan Pantas",
    home_page: "Laman Utama",

    // --- Forgot Password Page ---
    reset_page_title: 'Tetapkan Semula Kata Laluan Anda',
    reset_instructions: 'Masukkan nama pengguna dan e-mel berdaftar anda, kemudian tetapkan kata laluan baharu.',
    new_password_label: 'Kata Laluan Baharu',
    reset_button: 'Tetapkan Semula Kata Laluan',
    back_to_login: 'Kembali ke Log Masuk',

    // --- Navigation Page ---
    iam_at: 'Saya di:',
    station_map: 'Peta Stesen',
    station_levels: 'Tingkat Stesen',
    ground_floor: 'Tingkat Bawah',
    platform_level: 'Tingkat Platform',
    navigation_type: 'Jenis Navigasi',
    escalator_route: 'Laluan Eskalator',
    elevator_route: 'Laluan Lif',
    accessible_route: 'Laluan Akses OKU',
    facility_info: 'Maklumat Kemudahan',
    tap_any_dot: 'Ketuk mana-mana titik di peta untuk melihat butirannya.',
    get_directions: 'Dapatkan Arah',
    current_station_prefix: 'Stesen Semasa: ',
    change_station: 'Tukar Stesen',
    directions: 'Arah',
    ar_demo: 'Demo AR',
    ar_view_mockup: 'Papar AR (Mock-up)',
    select_current_location_prompt: 'Sila pilih lokasi semasa anda di menu juntai "Saya di".',
    start_not_found: 'Lokasi permulaan yang dipilih tidak ditemui dalam peta stesen.',
    cross_level_unavailable: 'Navigasi antara tingkat tidak tersedia untuk aras ini.',
    map_coming_soon: 'Peta akan datang...',
    on_level: "di",

    // --- Station Select Page ---
    select_current_station: 'Pilih Stesen Semasa',
    select_line_prompt: 'Pilih laluan anda, kemudian pilih stesen untuk meneruskan.',
    search_placeholder: 'Cari stesen...',
    continue_to_map: 'Teruskan ke Peta',
    line_label: 'Laluan',

    // --- Attraction Pages ---
    about_header: 'Tentang',
    station_info_header: 'Maklumat Stesen',
    nearest_station: 'Stesen LRT Terdekat:',
    line_label_detail: 'Laluan:',
    station_code: 'Kod Stesen:',
    interchange: 'Pertukaran:',
    nearby_landmarks: 'Mercu Tanda Berdekatan:',
    facilities: 'Kemudahan:',
    navigate_in_station: 'Navigasi dalam stesen',

    klcc_p1: 'KLCC menempatkan <b>Menara Berkembar Petronas</b> yang ikonik, antara struktur berkembar tertinggi di dunia. Mercu tanda ini telah menjadi simbol pembangunan pesat Malaysia dan landskap bandar moden.',
    klcc_p2: 'Di sekitar menara terdapat <b>Suria KLCC</b>, sebuah pusat beli-belah terkemuka yang menawarkan jenama mewah, pelbagai pilihan tempat makan, dan pengalaman panggung wayang yang hebat. Taman KLCC menyediakan kehijauan yang indah dengan laluan joging, air pancut, dan taman permainan, menjadikannya destinasi popular untuk penduduk tempatan dan pelancong. Pengunjung juga boleh menerokai <b>Aquaria KLCC</b>, salah satu akuarium terkemuka di Asia Tenggara.',
    klcc_station_p: 'Stesen KLCC menghubungkan penumpang terus ke pusat daerah komersial Kuala Lumpur. Ia direka untuk aksesibiliti tinggi, dengan eskalator dan lif untuk memenuhi semua keperluan pengunjung. Stesen ini terletak secara strategik di bawah tanah, menyediakan akses terlindung ke tarikan utama dan integrasi lancar dengan kawasan membeli-belah dan perniagaan sekitarnya.',
    bukit_p1: 'Bukit Bintang ialah nadi “Segitiga Emas” Kuala Lumpur, sebuah daerah meriah yang terkenal dengan pusat beli-belah, tempat makan dan hiburan. Kawasan ini menempatkan pusat beli-belah bertaraf dunia seperti Pavilion Kuala Lumpur, Fahrenheit88, dan Lot 10, menjadikannya hab fesyen dan runcit di bandar ini. Pada waktu malam, jalan-jalan berubah dengan lampu neon, bar atas bumbung, dan kelab malam yang sibuk.',
    bukit_p2: 'Tidak jauh dari situ terdapat Jalan Alor, syurga makanan jalanan yang menarik penduduk tempatan dan pelancong dengan makanan laut bakar, sate, dan pencuci mulut tropika. Sama ada anda mencari jenama mewah, hiburan malam yang meriah, atau perisa asli Malaysia, Bukit Bintang menawarkan gabungan unik tenaga bandar moden dan pesona tradisional.',
    bukit_station_p: 'Stesen Masjid Jamek adalah salah satu stesen pertukaran yang paling sibuk dan penting di Kuala Lumpur. Ia menghubungkan tiga laluan LRT utama – Kelana Jaya, Sri Petaling, dan Ampang – membolehkan pertukaran yang lancar di seluruh bandar. Stesen ini terletak hanya beberapa langkah dari masjid dan mercu tanda warisan lain, menjadikannya hab yang mudah untuk penumpang dan pelancong.',
    petaling_p1: 'Jalan Petaling, juga dikenali sebagai Chinatown Kuala Lumpur, adalah salah satu daerah paling ikonik dan bersejarah di bandar ini. Ia merupakan pasar yang meriah dipenuhi dengan gerai-gerai yang menjual segala-galanya daripada pakaian, aksesori, dan cenderamata hinggalah herba tradisional Cina dan makanan jalanan. Pengunjung boleh menikmati tawar-menawar dengan penjual sambil merasai suasana meriah yang mencerminkan semangat pelbagai budaya Kuala Lumpur.',
    petaling_p2: 'Pada waktu malam, kawasan ini berubah menjadi bazar yang berwarna-warni, dengan tanglung bercahaya menerangi jalan-jalan dan gerai makanan yang menawarkan juadah tempatan seperti mi wantan, nasi ayam claypot, dan teh herba yang terkenal. Selain membeli-belah dan menjamu selera, kawasan ini juga menempatkan beberapa kuil dan bangunan warisan yang mempamerkan kepentingan sejarah masyarakat Cina di Malaysia.',
    petaling_station_p: 'Stesen ini sendiri direka untuk kebolehcapaian dan keselesaan. Ia mempunyai eskalator, lif, dan papan tanda yang jelas untuk membimbing pengembara dengan lancar. Reka letak bawah tanahnya juga menyediakan perlindungan daripada keadaan cuaca, menjadikannya ideal untuk pelawat yang merancang untuk menerokai bandar dengan berjalan kaki. Kemudahan berdekatan termasuk medan selera, kedai serbaneka, dan ruang budaya, memastikan penumpang mendapat semua yang mereka perlukan sebaik sahaja melangkah keluar.',
    central_market_p1: 'Pasar Seni (Central Market) ialah mercu tanda budaya di tengah-tengah Kuala Lumpur, asalnya ditubuhkan sebagai pasar basah pada awal abad ke-20 dan kemudian diubah menjadi pusat warisan untuk seni dan kraf tangan Malaysia. Hari ini ia merupakan hab yang meriah di mana pengunjung boleh menemui batik tradisional, cenderamata buatan tangan, karya seni tempatan, dan persembahan yang meraikan warisan pelbagai budaya Malaysia.',
    central_market_p2: 'Arked berbumbung pasar ini menempatkan puluhan gerai dan kedai butik, mempamerkan artisan dan pereka yang mahir. Selain membeli-belah, Pasar Seni sering menganjurkan acara kebudayaan, bengkel kraf dan pameran kecil yang memberikan rasa budaya Malaysia yang asli. Ia adalah persinggahan kegemaran bagi pengunjung yang ingin membeli kenang-kenangan buatan tempatan dan mengalami sisi seni bandar.',
    central_market_station_p: 'Stesen ini sendiri direka untuk kebolehcapaian dan keselesaan. Ia mempunyai eskalator, lif, dan papan tanda yang jelas untuk membimbing pengembara dengan lancar. Reka letak bawah tanahnya juga menyediakan perlindungan daripada keadaan cuaca, menjadikannya ideal untuk pelawat yang merancang untuk menerokai bandar dengan berjalan kaki. Kemudahan berdekatan termasuk medan selera, kedai serbaneka, dan ruang budaya, memastikan penumpang mendapat semua yang mereka perlukan sebaik sahaja melangkah keluar.',
    titiwangsa_p1: 'Titiwangsa ialah destinasi rekreasi popular di Kuala Lumpur, terkenal dengan <b>Taman Tasik Titiwangsa</b> yang luas. Taman ini menawarkan trek joging, laluan berbasikal, aktiviti berperahu, dan ruang hijau terbuka untuk keluarga berehat. Ia juga menempatkan <b>Istana Budaya (Teater Kebangsaan)</b> dan <b>Balai Seni Negara</b>, menjadikannya hab budaya yang menggabungkan alam semula jadi dengan seni dan persembahan.',
    titiwangsa_p2: 'Kawasan ini menjadi kegemaran penduduk tempatan dan pelancong, menyediakan tempat percutian yang damai dari kesibukan pusat bandar sambil mudah diakses dengan pengangkutan awam.',
    titiwangsa_station_p: 'Stesen Titiwangsa menghubungkan penumpang terus ke salah satu kawasan rekreasi paling meriah di Kuala Lumpur. Ia direka untuk kebolehcapaian dan kemudahan, dengan kemudahan moden yang menjadikan perjalanan selesa untuk semua pelawat. Dari stesen, penumpang boleh sampai ke taman tasik, mercu tanda budaya, dan ruang hijau dengan mudah yang mentakrifkan daerah Titiwangsa.',
    bird_park_p1: 'Taman Burung KL adalah salah satu sangkar burung penerbangan bebas terbesar di dunia, menempatkan beribu-ribu burung dari seluruh dunia. Pengunjung boleh menikmati pertemuan dekat dengan spesies eksotik, sesi memberi makan interaktif, dan pameran pendidikan yang memberi tumpuan kepada pemuliharaan burung.',
    bird_park_p2: 'Mudah diakses melalui LRT, Taman Burung KL menyediakan pelarian yang tenang dari kesibukan bandar sambil menawarkan pengalaman yang menyeronokkan dan pendidikan untuk keluarga, pelancong, dan peminat burung.',
    bird_station_p: 'Stesen ini sendiri direka untuk kebolehcapaian dan keselesaan. Ia mempunyai eskalator, lif, dan papan tanda yang jelas untuk membimbing pengembara dengan lancar. Reka letak bawah tanahnya juga menyediakan perlindungan daripada keadaan cuaca, menjadikannya ideal untuk pelawat yang merancang untuk menerokai bandar dengan berjalan kaki. Kemudahan berdekatan termasuk medan selera, kedai serbaneka, dan ruang budaya, memastikan penumpang mendapat semua yang mereka perlukan sebaik sahaja melangkah keluar.',

    // --- Index Page Constraint ---
    login_required: 'Anda mesti log masuk untuk menggunakan navigasi. Sila log masuk dahulu.',

    // --- PHP Script Messages ---
    all_fields_required: 'Semua medan diperlukan!',
    passwords_do_not_match: 'Kata laluan tidak sepadan!',
    password_too_short: 'Kata laluan mesti sekurang-kurangnya 6 aksara.',
    signup_success: 'Pendaftaran berjaya! Anda kini boleh log masuk.',
    signup_failed: 'Pendaftaran gagal. Sila cuba lagi.',
    user_exists: 'Nama pengguna atau e-mel sudah wujud!',
    login_success: 'Log masuk berjaya! Selamat kembali.',
    login_failed_password: 'Kata laluan salah.',
    login_failed_username: 'Nama pengguna tidak dijumpai.',
    reset_success: 'Penetapan semula kata laluan berjaya! Anda kini boleh log masuk dengan kata laluan baharu anda.',
    reset_failed_update: 'Gagal mengemas kini kata laluan. Sila cuba lagi.',
    reset_failed_email_mismatch: 'Alamat e-mel tidak sepadan dengan akaun untuk nama pengguna ini.',
    logout_success: 'Anda telah berjaya log keluar.',

    // --- Delete Account ---
    delete_account_button: 'Padam Akaun',
    delete_confirm_1: 'Adakah anda pasti ingin memadam akaun anda? Tindakan ini tidak boleh dibuat asal.',
    delete_prompt_password: 'Untuk mengesahkan pemadaman, sila masukkan kata laluan anda:',
    delete_confirm_2: 'PENGESAHAN AKHIR: Padam akaun secara kekal?',
    delete_cancelled: 'Pemadaman akaun dibatalkan.',
    delete_success: 'Akaun anda telah berjaya dipadam.',
    delete_error_generic: 'Ralat berlaku. Sila cuba lagi.',
    delete_error_not_logged_in: 'Anda mesti log masuk untuk memadam akaun anda.',
    delete_error_password: 'Kata laluan salah. Akaun tidak dipadam.',

    // --- 【【【 翻译添加在这里 】】】 ---
    edit_profile_title: 'LRT GuideMe – Sunting Profil',
    edit_profile_button:'Sunting',
    edit_profile_heading: 'Sunting Profil Anda',
    edit_profile_description: 'Kemas kini nama pengguna, e-mel, atau kata laluan anda di bawah.',
    save_button: 'Simpan Perubahan',
    cancel_button: 'Batal',
    alert_login_first: "Sila log masuk terlebih dahulu.",
    alert_load_profile_error: "Ralat semasa memuatkan profil.",
    alert_update_success: "Profil berjaya dikemas kini!",
    alert_update_failed: "Kemas kini gagal.",
    alert_update_error: "Ralat semasa mengemas kini profil.",
    avatar_label:"Gambar Profil",
    choose_file_btn: "Pilih Fail",
    no_file_chosen: "Tiada fail dipilih",
    password_placeholder: "Biarkan kosong untuk mengekalkan kata laluan semasa",
    danger_zone: "Zon Bahaya",
    danger_zone_desc: "Memadam akaun anda adalah kekal dan tidak boleh dibatalkan.",
    delete_account_button_long: "Padam Akaun Ini",

    // --- Admin Page ---
    welcome_admin: 'Selamat datang, {name}!',
    admin_dashboard_title: 'Papan Pemuka Pentadbir',
    logout_button_admin: 'Log Keluar',
    admin_login_title: 'Log Masuk Pentadbir',
    admin_login_button: 'Log Masuk sebagai Pentadbir',
    back_to_user_login: 'Kembali ke log masuk pengguna',
    admin_username_placeholder: 'Masukkan nama pengguna pentadbir',
    admin_password_placeholder: 'Masukkan kata laluan pentadbir',
    admin_not_found: 'Akaun pentadbir tidak dijumpai.',
    invalid_password: 'Kata laluan salah.'
  },
  zh: {
    // --- General ---
    welcome: '在轻轨站内找到自己的路',
    tagline: '您的轻轨站智能导航伴侣。',
    start_navigation: '开始导航',
    micro_info: '点击选择当前车站 → 选择车站内的目的地。',
    popular_attractions: '马来西亚热门景点',
    view_details: '查看详情',
    back: '← 返回',
    login_btn: '登录',

    // --- Login Page ---
    login_title: '登录 LRT GuideMe',
    username_label: '用户名',
    password_label: '密码',
    login_button: '登录',
    forgot_password: '忘记密码？',
    no_account: '还没有账户？',
    sign_up: '在此注册',
    admin_login_prompt: "以管理员身份登录？",
    admin_login_link: "在此登录",

    // --- Sign Up Page ---
    signup_title: '创建您的账户',
    email_label: '电子邮件',
    confirm_password_label: '确认密码',
    signup_button: '注册',
    have_account: '已有账户？',
    login_here: '在此登录',

    // --- User Page ---
    user_page_title: 'LRT GuideMe – 用户资料',
    welcome_prefix: '欢迎, ',
    logged_in_status: '您已登录 LRT GuideMe。',
    logout_button: '登出',
    back_to_navigation: "返回导航",
    quick_links: "快速导航",
    home_page: "返回首页",

    // --- Forgot Password Page ---
    reset_page_title: '重置您的密码',
    reset_instructions: '输入您的用户名和注册邮箱，然后设置新密码。',
    new_password_label: '新密码',
    reset_button: '重置密码',
    back_to_login: '返回登录',

    // --- Navigation Page ---
    iam_at: '我在：',
    station_map: '车站地图',
    station_levels: '站层',
    ground_floor: '底楼',
    platform_level: '站台层',
    navigation_type: '导航类型',
    escalator_route: '扶梯路线',
    elevator_route: '电梯路线',
    accessible_route: '无障碍路线',
    facility_info: '设施信息',
    tap_any_dot: '点击地图上的任意点查看其详情。',
    get_directions: '获取路线',
    current_station_prefix: '当前车站：',
    change_station: '更换车站',
    directions: '路线指引',
    ar_demo: 'AR 展示',
    ar_view_mockup: 'AR 视图 (模拟)',
    select_current_location_prompt: '请在下拉列表中选择您的当前位置。',
    start_not_found: '所选起点未在站点地图中找到。',
    cross_level_unavailable: '这些楼层之间无法进行跨层导航。',
    map_coming_soon: '地图即将上线...',
    on_level: "在",

    // --- Station Select Page ---
    select_current_station: '选择当前车站',
    select_line_prompt: '选择线路，然后选择车站以继续。',
    search_placeholder: '搜索车站...',
    continue_to_map: '继续到地图',
    line_label: '线路',

    // --- Attraction Pages ---
    about_header: '关于',
    station_info_header: '车站信息',
    nearest_station: '最近的轻轨站:',
    line_label_detail: '线路:',
    station_code: '站点代码:',
    interchange: '换乘:',
    nearby_landmarks: '附近地标:',
    facilities: '设施:',
    navigate_in_station: '站内导航',
    
    klcc_p1: 'KLCC 是标志性的<b>双峰塔（Petronas Twin Towers）</b>的所在地，这是世界上最高的双子建筑之一。这座地标已成为马来西亚快速发展和现代城市景观的象征。',
    klcc_p2: '塔楼周围是<b>阳光广场（Suria KLCC）</b>，这是一个高级购物中心，提供奢侈品牌、多样化的餐饮选择和绝佳的电影院体验。KLCC 公园提供了一个风景优美的绿色休闲空间，设有慢跑道、喷泉和游乐场，使其成为本地人和游客的热门去处。游客还可以探索 <b>Aquaria KLCC</b>，这是东南亚领先的水族馆之一。',
    klcc_station_p: 'KLCC 站将乘客直接连接到吉隆坡商业区的中心地带。它设计为高度便利，配有自动扶梯和电梯，以满足所有游客的需求。该站战略性地位于地下，提供前往主要景点的遮蔽通道，并与周围的购物和商业区无缝整合。',
    bukit_p1: '武吉免登（Bukit Bintang）是吉隆坡“金三角”的跳动心脏，是一个以购物、餐饮和娱乐而闻名的繁华地区。这里拥有 Pavilion Kuala Lumpur、Fahrenheit88 和 Lot 10 等世界级购物中心，使其成为城市的时尚和零售中心。到了晚上，街道上霓虹闪烁，屋顶酒吧和熙熙攘攘的夜总会使这里焕然一新。',
    bukit_p2: '仅几步之遥便是亚罗街（Jalan Alor），这是一个美食天堂，以其烤海鲜、沙爹和热带甜点吸引着本地人和游客。无论您是寻找奢侈品牌、充满活力的夜生活，还是地道的马来西亚风味，武吉免登都提供了现代城市活力与传统魅力的独特融合。',
    bukit_station_p: 'Masjid Jamek 站是吉隆坡最繁忙和最重要的换乘站之一。它直接连接三条主要的轻轨线路——Kelana Jaya 线、Sri Petaling 线和 Ampang 线——实现整个城市的无缝换乘。该站距离清真寺和其他历史地标仅几步之遥，使其成为通勤者和游客的便利枢纽。',
    petaling_p1: '茨厂街（Petaling Street），又称吉隆坡唐人街，是该市最具标志性和历史性的地区之一。这是一个热闹的市集，遍布着无数摊位，出售从衣服、配饰、纪念品到传统中草药和街头小吃的各种商品。游客可以在与摊主讨价还价的同时，体验反映吉隆坡多元文化精神的活力氛围。',
    petaling_p2: '到了晚上，该地区变成一个五彩缤纷的夜市，发光的灯笼照亮街道，食品摊位提供云吞面、瓦煲鸡饭和著名的凉茶等当地美食。除了购物和餐饮，该地区还拥有数座寺庙和历史建筑，展示了华人社区在马来西亚的历史重要性。',
    petaling_station_p: '该站本身设计注重可达性和舒适性。它配备自动扶梯、电梯和清晰的标牌，以引导旅客顺利通行。其地下布局还提供了遮风挡雨的条件，非常适合计划步行探索城市的游客。附近的设施包括美食广场、便利店和文化空间，确保乘客一出站就能获得所需的一切。',
    central_market_p1: '中央艺术坊（Central Market / Pasar Seni）是吉隆坡市中心的一个文化地标，最初在20世纪初是一个菜市场，后来转变为马来西亚艺术和手工艺的遗产中心。如今，它是一个充满活力的中心，游客可以在这里发现传统的蜡染、手工纪念品、本地艺术品以及庆祝马来西亚多元文化遗产的表演。',
    central_market_p2: '市场的室内拱廊拥有数十个摊位和精品店，展示了技艺精湛的工匠和设计师的作品。除了购物，中央艺术坊还经常举办文化活动、手工艺工作坊和小型展览，提供地道的马来西亚文化体验。对于想要购买本地制作的纪念品并体验城市艺术一面的游客来说，这里是一个热门的停留点。',
    central_market_station_p: '该站本身设计注重可达性和舒适性。它配备自动扶梯、电梯和清晰的标牌，以引导旅客顺利通行。其地下布局还提供了遮风挡雨的条件，非常适合计划步行探索城市的游客。附近的设施包括美食广场、便利店和文化空间，确保乘客一出站就能获得所需的一切。',
    titiwangsa_p1: '蒂蒂旺沙（Titiwangsa）是吉隆坡一个受欢迎的休闲目的地，以广阔的<b>蒂蒂旺沙湖滨公园</b>而闻名。该公园提供慢跑道、自行车道、划船活动和供家庭放松的开阔绿地。这里也是<b>国家剧院（Istana Budaya）</b>和<b>国家美术馆</b>的所在地，使其成为一个将自然与艺术和表演融为一体的文化中心。',
    titiwangsa_p2: '该地区深受当地人和游客的喜爱，提供了一个远离市中心喧嚣的宁静休憩之地，同时通过公共交通仍可轻松抵达。',
    titiwangsa_station_p: '蒂蒂旺沙站将乘客直接连接到吉隆坡最充满活力的休闲区之一。它的设计注重可达性和便利性，拥有现代化的设施，使所有游客的旅行都感到舒适。从车站出发，乘客可以轻松到达构成蒂蒂旺沙区的湖滨公园、文化地标和绿色空间。',
    bird_park_p1: '吉隆坡飞禽公园（KL Bird Park）是世界上最大的自由飞翔鸟舍之一，栖息着来自全球的数千只鸟类。游客可以与奇异物种近距离接触，参与互动喂食，并参观专注于鸟类保护的教育展览。',
    bird_park_p2: '通过轻轨可轻松抵达，吉隆坡飞禽公园提供了一个远离城市喧嚣的宁静之地，同时为家庭、游客和鸟类爱好者提供了有趣和教育性的体验。',
    bird_station_p: '该站本身设计注重可达性和舒适性。它配备自动扶梯、电梯和清晰的标牌，以引导旅客顺利通行。其地下布局还提供了遮风挡雨的条件，非常适合计划步行探索城市的游客。附近的设施包括美食广场、便利店和文化空间，确保乘客一出站就能获得所需的一切。',

    // --- Index Page Constraint ---
    login_required: '您必须登录才能使用导航功能。请先登录。',

    // --- PHP Script Messages ---
    all_fields_required: '所有字段均为必填项！',
    passwords_do_not_match: '两次输入的密码不匹配！',
    password_too_short: '密码长度必须至少为 6 个字符。',
    signup_success: '注册成功！您现在可以登录了。',
    signup_failed: '注册失败。请再试一次。',
    user_exists: '用户名或电子邮件已存在！',
    login_success: '登录成功！欢迎回来。',
    login_failed_password: '密码错误。',
    login_failed_username: '未找到该用户名。',
    reset_success: '密码重置成功！您现在可以使用新密码登录。',
    reset_failed_update: '更新密码失败。请再试一次。',
    reset_failed_email_mismatch: '该电子邮件地址与此用户名的账户不匹配。',
    logout_success: '您已成功登出。',

    // --- Delete Account ---
    delete_account_button: '删除账户',
    delete_confirm_1: '您确定要删除您的账户吗？此操作无法撤销。',
    delete_prompt_password: '为确认删除，请输入您的密码：',
    delete_confirm_2: '最后确认：永久删除账户？',
    delete_cancelled: '账户删除已取消。',
    delete_success: '您的账户已成功删除。',
    delete_error_generic: '发生错误，请重试。',
    delete_error_not_logged_in: '您必须登录才能删除您的账户。',
    delete_error_password: '密码不正确。账户未删除。',

    // --- 【【【 翻译添加在这里 】】】 ---
    edit_profile_title: 'LRT GuideMe – 编辑资料',
    edit_profile_button:'编辑',
    edit_profile_heading: '编辑您的资料',
    edit_profile_description: '您可以在下方更新用户名、邮箱或密码。',
    save_button: '保存更改',
    cancel_button: '取消',
    alert_login_first: "请先登录。",
    alert_load_profile_error: "加载个人资料时出错。",
    alert_update_success: "资料更新成功！",
    alert_update_failed: "更新失败。",
    alert_update_error: "更新资料时发生错误。",
    avatar_label: "头像:",
    choose_file_btn: "选择文件",
    no_file_chosen: "未选择任何文件",
    password_placeholder: "留空以保持当前密码",
    danger_zone: "危险区域",
    danger_zone_desc: "删除您的账户是永久性的，无法撤销。",
    delete_account_button_long: "删除此账户",
    
    // --- Admin Page ---
    welcome_admin: '欢迎, {name}！',
    admin_dashboard_title: '管理员控制面板',
    logout_button_admin: '登出',
    admin_login_title: '管理员登录',
    admin_login_button: '以管理员身份登录',
    back_to_user_login: '返回用户登录',
    admin_username_placeholder: '请输入管理员用户名',
    admin_password_placeholder: '请输入管理员密码',
    admin_not_found: '未找到管理员账户。',
    invalid_password: '密码错误。'
  }
};

// Expose translations to global scope for other scripts (e.g., navigation.js)
window.translations = translations;

// Save current selected language in a global variable. Default is English.
window.currentLang = 'en';

/**
 * Translate a given text using LibreTranslate API (via local PHP proxy).
 * @param {string} text - Text to translate.
 * @param {string} targetLang - Target language code (e.g., 'ms', 'zh').
 * @param {string} sourceLang - Source language code (default 'en').
 * @returns {Promise<string>} Translated text.
 */
async function translateExternal(text, targetLang, sourceLang = 'en') {
  try {
    // 请求本地的 PHP 代理脚本
    const resp = await fetch('translate_api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text, lang: targetLang })
    });

    if (!resp.ok) throw new Error('Translation request failed');
    const data = await resp.json();
    return data.translatedText || text;
  } catch (err) {
    console.error('translateExternal error', err);
    return text;
  }
}

// Make the translateExternal function accessible globally (used in navigation.js)
window.translateExternal = translateExternal;

/**
 * Apply static translations to all elements with data-i18n-key attribute.
 * Falls back to original text if translation is not found.
 * @param {string} lang - Language code to apply.
 */
function applyTranslations(lang) {
  window.currentLang = lang;
  const langDict = translations[lang] || {};
  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-key');
    // Save original text on first run
    if (!el.hasAttribute('data-i18n-original')) {
      // Handle title tag differently
      if (el.tagName.toLowerCase() === 'title') {
         el.setAttribute('data-i18n-original', document.title);
      } else {
         el.setAttribute('data-i18n-original', el.innerHTML.trim()); // Trim whitespace, keep HTML
      }
    }
    const original = el.getAttribute('data-i18n-original');

    // Always use original text for 'en' or if translation is missing
    const translated = (lang !== 'en' && langDict[key]) ? langDict[key] : original;

    // Update only if text content is different
    // Check if the element is the title tag
    if (el.tagName.toLowerCase() === 'title') {
        if (document.title !== translated) {
            document.title = translated;
        }
    } else if (el.innerHTML.trim() !== translated) {
       el.innerHTML = translated; // Use innerHTML to render <b> tags
    }
  });

  // Translate placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!el.hasAttribute('data-i18n-original-placeholder')) { // Use a different attribute name
      // save original placeholder
      el.setAttribute('data-i18n-original-placeholder', el.getAttribute('placeholder') || '');
    }
    const originalPlaceholder = el.getAttribute('data-i18n-original-placeholder');

    const translatedPlaceholder = (lang !== 'en' && langDict[key]) ? langDict[key] : originalPlaceholder;

    if (el.getAttribute('placeholder') !== translatedPlaceholder) {
        el.setAttribute('placeholder', translatedPlaceholder);
    }
  });
}

// Attach applyTranslations to the language selector if present
document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('langSelect');
  if (sel) {
    // On load, use stored language if available
    const storedLang = localStorage.getItem('preferredLang');
    if (storedLang && translations[storedLang]) {
      sel.value = storedLang;
    }
    // Trigger initial translation
    applyTranslations(sel.value || 'en');

    // When language selection changes, apply translation and persist it
    sel.addEventListener('change', (e) => {
      const lang = e.target.value;
      applyTranslations(lang);
      try {
        localStorage.setItem('preferredLang', lang);
      } catch (err) {
        console.warn('Unable to save preferred language', err);
      }

      // If translateExternal exists, re-translate dynamic elements (like attraction paragraphs)
      if (typeof window.translateExternal === 'function' && typeof window.applyDynamicTranslations === 'function') {
           window.applyDynamicTranslations(lang); // Assume attraction.js defines this
      }
    });
  }
});