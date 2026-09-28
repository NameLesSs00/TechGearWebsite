import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJlbWFpbCI6Im1pbmFAZ2Vhci5jb20iLCJuYW1laWQiOiIxNmRiNmJkZS04YjdhLTRmZTMtYTI5NS1mOWM3MDAzYjc5ZmMiLCJ1bmlxdWVfbmFtZSI6Im1pbmFAZ2Vhci5jb20iLCJqdGkiOiJjZDE5Yzg5NC00NjUxLTQ1ZWMtYWI4ZC0yYzllYWU2YzY1YWQiLCJyb2xlIjpbIkFkbWluIiwiQWRtaW4iXSwibmJmIjoxNzkwNjEwMTk2LCJleHAiOjE3OTA2OTY1OTYsImlhdCI6MTc5MDYxMDE5NiwiaXNzIjoiVGVjaEdlYXIiLCJhdWQiOiJUZWNoR2VhciJ9.oS_svGDKobsMEdZtWVfWSfgt76L4_u-ujrE-OCCuMmo';
const base_url = 'https://tech-gear-backend-site.premiumasp.net/api';
const category_id = '5e26f01d-8424-41e1-ac27-f9fa7d0ce9cb'; // Web Development

async function run() {
    try {
        console.log("Creating SunnySide Tours project...");

        const fd = new FormData();
        fd.append("CategoryId", category_id);
        fd.append("ProjectLink", "https://sunnyside-tours.com/en");

        // Use the white logo we generated
        const iconPath = path.join(__dirname, 'Logo_white.png');
        if (fs.existsSync(iconPath)) {
            fd.append("IconImage", fs.createReadStream(iconPath));
        }

        const heroPath = path.join(__dirname, 'sunnyside-tours.com-en.png');
        if (fs.existsSync(heroPath)) {
            fd.append("HeroImage", fs.createReadStream(heroPath));
        }

        // English Translation
        fd.append("Translations[0].LanguageCode", "en");
        fd.append("Translations[0].Title", "SunnySide Tours");
        fd.append("Translations[0].Description", "A modern, high-performance web platform for an Egyptian tourism agency. It allows users to explore destinations like the Red Sea, Pyramids, and Luxor, seamlessly book tours, and create unforgettable memories.");
        fd.append("Translations[0].Industry", "Travel & Tourism");
        fd.append("Translations[0].ProjectType", "Web Platform");
        fd.append("Translations[0].Services", "Web Development, UI/UX Design, Performance Optimization");
        fd.append("Translations[0].Platform", "Next.js");

        // Arabic Translation
        fd.append("Translations[1].LanguageCode", "ar");
        fd.append("Translations[1].Title", "صني سايد تورز (SunnySide Tours)");
        fd.append("Translations[1].Description", "منصة ويب حديثة وعالية الأداء لوكالة سياحة مصرية. تتيح للمستخدمين استكشاف الوجهات مثل البحر الأحمر والأهرامات والأقصر، وحجز الجولات بسلاسة، وصنع ذكريات لا تُنسى.");
        fd.append("Translations[1].Industry", "السياحة والسفر");
        fd.append("Translations[1].ProjectType", "منصة ويب");
        fd.append("Translations[1].Services", "تطوير الويب، تصميم واجهة وتجربة المستخدم، تحسين الأداء");
        fd.append("Translations[1].Platform", "Next.js");

        const response = await axios.post(`${base_url}/projects`, fd, {
            headers: {
                ...fd.getHeaders(),
                'Authorization': `Bearer ${token}`
            },
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });

        console.log("Project created successfully!", response.data);
    } catch (error: any) {
        console.error("Error creating project:", error.response?.data || error.message);
    }
}

run();
