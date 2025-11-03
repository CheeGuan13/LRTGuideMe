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
    klcc_p1: 'KLCC is home to the iconic Petronas Twin Towers...',
    klcc_p2: 'Surrounding the towers is Suria KLCC...',
    klcc_station_p: 'KLCC Station directly connects passengers...',
    bukit_p1: 'Bukit Bintang is the beating heart...',
    bukit_p2: 'Just steps away lies Jalan Alor...',
    bukit_station_p: 'Masjid Jamek Station is one of the busiest...',
    petaling_p1: 'Petaling Street, also known as Chinatown...',
    petaling_p2: 'At night, the area transforms...',
    petaling_station_p: 'The station itself is designed...',
    central_market_p1: 'Central Market (Pasar Seni) is a cultural landmark...',
    central_market_p2: 'The market’s covered arcade...',
    central_market_station_p: 'The station itself is designed...',
    titiwangsa_p1: 'Titiwangsa is a popular recreational destination...',
    titiwangsa_p2: 'The area is a favourite among...',
    titiwangsa_station_p: 'Titiwangsa Station directly connects...',
    bird_park_p1: 'KL Bird Park is one of the largest...',
    bird_park_p2: 'Easily accessible via LRT...',
    bird_station_p: 'The station itself is designed...',

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
    delete_error_password: 'Password incorrect. Account not deleted.',// Match login_failed_password for consistency

    // --- Edit Profile Page ---
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

    // --- Admin Page ---
    welcome_admin: 'Welcome, {name}!',
    admin_dashboard_title: 'Admin Dashboard',
    logout_button_admin: 'Logout',
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

    // --- Sign Up Page ---
    signup_title: 'Cipta Akaun Anda',
    email_label: 'E-mel',
    confirm_password_label: 'Sahkan Kata Laluan',
    signup_button: 'Daftar',
    have_account: 'Sudah mempunyai akaun?',
    login_here: 'Log masuk di sini',
    admin_login_prompt: "Log masuk sebagai pentadbir?",
    admin_login_link: "Log masuk di sini",

    // --- User Page ---
    user_page_title: 'LRT GuideMe – Profil Pengguna',
    welcome_prefix: 'Selamat datang, ',
    logged_in_status: 'Anda telah log masuk ke LRT GuideMe.',
    logout_button: 'Log Keluar',

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
    klcc_p1: 'KLCC menempatkan Menara Berkembar Petronas...',
    klcc_p2: 'Di sekitar menara terdapat Suria KLCC...',
    klcc_station_p: 'Stesen KLCC menghubungkan penumpang...',
    bukit_p1: 'Bukit Bintang ialah nadi...',
    bukit_p2: 'Tidak jauh dari situ terletak Jalan Alor...',
    bukit_station_p: 'Stesen Masjid Jamek merupakan salah satu...',
    petaling_p1: 'Jalan Petaling, juga dikenali sebagai Chinatown...',
    petaling_p2: 'Pada waktu malam, kawasan ini bertukar...',
    petaling_station_p: 'Stesen ini direka untuk aksesibiliti...',
    central_market_p1: 'Pasar Seni ialah mercu tanda budaya...',
    central_market_p2: 'Arked berbumbung pasar ini menempatkan...',
    central_market_station_p: 'Stesen ini direka untuk aksesibiliti...',
    titiwangsa_p1: 'Titiwangsa ialah destinasi rekreasi popular...',
    titiwangsa_p2: 'Kawasan ini digemari oleh penduduk...',
    titiwangsa_station_p: 'Stesen Titiwangsa menghubungkan penumpang...',
    bird_park_p1: 'Taman Burung KL ialah salah satu aviari...',
    bird_park_p2: 'Mudah diakses melalui LRT...',
    bird_station_p: 'Stesen ini direka untuk aksesibiliti...',

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

    // --- Edit Profile Page ---
    edit_profile_button:'Sunting',
    edit_profile_heading: 'Sunting Profil Anda',
    edit_profile_description: 'Kemas kini nama pengguna, e-mel, atau kata laluan anda di bawah.',
    save_button: 'Simpan Perubahan',
    alert_login_first: "Sila log masuk terlebih dahulu.",
    alert_load_profile_error: "Ralat semasa memuatkan profil.",
    alert_update_success: "Profil berjaya dikemas kini!",
    alert_update_failed: "Kemas kini gagal.",
    alert_update_error: "Ralat semasa mengemas kini profil.",
    avatar_label:"Gambar Profil",
    choose_file_btn: "Pilih Fail",
    no_file_chosen: "Tiada fail dipilih",

    // --- Admin Page ---
    welcome_admin: 'Selamat datang, {name}!',
    admin_dashboard_title: 'Papan Pemuka Pentadbir',
    logout_button_admin: 'Log Keluar',
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
    klcc_p1: 'KLCC 是著名的双子塔所在地...',
    klcc_p2: '塔楼周围是高级购物中心阳光广场...',
    klcc_station_p: 'KLCC 站将乘客直接带到...',
    bukit_p1: '武吉免登是吉隆坡“金三角”的心脏...',
    bukit_p2: '相距不远的亚罗街是美食天堂...',
    bukit_station_p: 'Jamek 清真寺站是吉隆坡最繁忙...',
    petaling_p1: '茨厂街，又称吉隆坡唐人街...',
    petaling_p2: '夜晚时分，这里摇身一变成...',
    petaling_station_p: '车站本身注重无障碍和舒适...',
    central_market_p1: '中央市场（茨厂街 Pasar Seni）是吉隆坡市中心...',
    central_market_p2: '市场的有盖拱廊聚集了许多...',
    central_market_station_p: '车站本身注重无障碍和舒适...',
    titiwangsa_p1: '蒂蒂旺莎是吉隆坡著名的休闲目的地...',
    titiwangsa_p2: '这一地区深受当地人和游客喜爱...',
    titiwangsa_station_p: '蒂蒂旺莎站让乘客直达吉隆坡...',
    bird_park_p1: '吉隆坡飞禽公园是世界最大的开放式...',
    bird_park_p2: '通过轻轨即可轻松抵达...',
    bird_station_p: '车站本身注重无障碍和舒适...',

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

    // --- Edit Profile Page ---
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
    avatar_label: "头像",
    choose_file_btn: "选择文件",
    no_file_chosen: "未选择任何文件",

    // --- Admin Page ---
    welcome_admin: '欢迎, {name}！',
    admin_dashboard_title: '管理员控制面板',
    logout_button_admin: '登出',
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
         el.setAttribute('data-i18n-original', el.textContent.trim()); // Trim whitespace
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
    } else if (el.textContent.trim() !== translated) {
       el.textContent = translated;
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

// Helper function possibly defined in attraction.js or similar for dynamic content
// Example:
// window.applyDynamicTranslations = async function(lang) {
//    // Find elements needing dynamic translation and call translateExternal
// }