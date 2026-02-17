
    // ================= SOP LOGIC =================
    function checkSOP() {
        const url1 = document.getElementById('url1').value;
        const url2 = document.getElementById('url2').value;
        const resultBox = document.getElementById('sop-result');

        try {
            const u1 = new URL(url1);
            const u2 = new URL(url2);

            if (u1.protocol === u2.protocol && u1.host === u2.host && u1.port === u2.port) {
                resultBox.innerHTML = "✅ Same Origin (مسموح): البروتوكول، الهوست، والمنفذ متطابقون.";
                resultBox.className = "result-box success";
            } else {
                let reason = "اختلاف في: ";
                if (u1.protocol !== u2.protocol) reason += "البروتوكول ";
                if (u1.host !== u2.host) reason += "المضيف ";
                if (u1.port !== u2.port) reason += "المنفذ";
                
                resultBox.innerHTML = `❌ Cross Origin (ممنوع): ${reason}`;
                resultBox.className = "result-box error";
            }
        } catch (e) {
            resultBox.innerHTML = "⚠️ يرجى إدخال روابط صحيحة (مثال: https://site.com)";
            resultBox.className = "result-box";
        }
    }

    // ================= CORS LOGIC =================
    function simulateCORS() {
        const setting = document.getElementById('server-cors-setting').value;
        const resultBox = document.getElementById('cors-result');
        const myOrigin = "https://my-bank.com";

        resultBox.innerHTML = "جاري إرسال الطلب...";

        setTimeout(() => {
            if (setting === "*" || setting === myOrigin) {
                resultBox.innerHTML = "✅ 200 OK: السيرفر قبل الطلب لأن الهيدر Access-Control-Allow-Origin يسمح لأصلك.";
                resultBox.className = "result-box success";
            } else {
                resultBox.innerHTML = `❌ CORS Error: المتصفح حظر الاستجابة. <br> أصلك هو ${myOrigin} <br> لكن السيرفر يسمح فقط لـ ${setting}`;
                resultBox.className = "result-box error";
            }
        }, 800);
    }

    // ================= CSP LOGIC =================
    function simulateXSS() {
        const input = document.getElementById('xss-input').value;
        const isCSPEnabled = document.getElementById('csp-toggle').checked;
        const contentDiv = document.getElementById('page-content');
        const logDiv = document.getElementById('csp-log');

        contentDiv.innerHTML = input; // محاكاة الحقن في الـ DOM

        // محاكاة استجابة المتصفح
        if (isCSPEnabled) {
            // بحث بسيط عن ايفنتات خطيرة
            if (input.includes('onerror') || input.includes('<script>')) {
                logDiv.innerHTML = "🛡️ تم حظر تنفيذ الكود! (Violated Content Security Policy directive: 'script-src')";
                logDiv.className = "result-box success";
                // في الواقع المتصفح لا ينفذ الكود، هنا نقوم فقط بتنظيف المحتوى للمحاكاة
                setTimeout(() => { alert("المتصفح (محاكاة): لقد منعت هذا الكود من التنفيذ بسبب CSP!"); }, 100);
            } else {
                logDiv.innerHTML = "تم إدراج النص (آمن ظاهرياً أو لم يتم اكتشافه بواسطة المحاكي البسيط).";
                logDiv.className = "result-box";
            }
        } else {
            // بدون CSP
            if (input.includes('alert')) {
                logDiv.innerHTML = "⚠️ تم تنفيذ الكود الخبيث! (XSS Successful)";
                logDiv.className = "result-box error";
                // تنفيذ الكود فعلياً (بشكل آمن للمستخدم)
                setTimeout(() => { alert("XSS Attack Successful! (تم اختراقك لأنه لا يوجد CSP)"); }, 100);
            } else {
                logDiv.innerHTML = "تم إدراج النص.";
                logDiv.className = "result-box";
            }
        }
    }

    // ================= QUIZ LOGIC =================
    const questions = [
        {
            q: "ما هي المكونات الثلاثة التي تحدد الـ Origin؟",
            options: ["HTML, CSS, JS", "Protocol, Host, Port", "Domain, IP, DNS"],
            ans: 1
        },
        {
            q: "إذا كان لديك موقع على المنفذ 80 وآخر على 8080، هل هما Same Origin؟",
            options: ["نعم", "لا", "فقط إذا كانا نفس البروتوكول"],
            ans: 1
        },
        {
            q: "ما هو الهيدر الذي يجب أن يرسله السيرفر للسماح بـ CORS؟",
            options: ["Access-Control-Allow-Origin", "Allow-All-Users", "X-Content-Type-Options"],
            ans: 0
        },
        {
            q: "كيف يساعد CSP في الحماية؟",
            options: ["يقوم بتشفير كلمات المرور", "يمنع تحميل الموارد (سكربتات/صور) من مصادر غير موثوقة", "يمنع SQL Injection"],
            ans: 1
        },
        {
            q: "أي مما يلي يعتبر إعداد CORS خطير جداً للبيانات الحساسة؟",
            options: ["Access-Control-Allow-Origin: https://site.com", "Access-Control-Allow-Origin: *", "Access-Control-Allow-Methods: GET"],
            ans: 1
        }
    ];

    const quizContainer = document.getElementById('quiz-container');

    questions.forEach((item, index) => {
        const qDiv = document.createElement('div');
        qDiv.style.marginBottom = "20px";
        qDiv.innerHTML = `
            <p><strong>س${index + 1}: ${item.q}</strong></p>
            ${item.options.map((opt, i) => `
                <label class="quiz-option">
                    <input type="radio" name="q${index}" value="${i}"> ${opt}
                </label>
            `).join('')}
        `;
        quizContainer.appendChild(qDiv);
    });

    function submitQuiz() {
        let score = 0;
        questions.forEach((item, index) => {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            const options = document.querySelectorAll(`input[name="q${index}"]`);
            
            // Reset colors
            options.forEach(opt => opt.parentElement.classList.remove('correct-answer', 'wrong-answer'));

            if (selected) {
                if (parseInt(selected.value) === item.ans) {
                    score++;
                    selected.parentElement.classList.add('correct-answer');
                } else {
                    selected.parentElement.classList.add('wrong-answer');
                    // Highlight correct one
                    options[item.ans].parentElement.classList.add('correct-answer');
                }
            }
        });

        const scoreDiv = document.getElementById('quiz-score');
        scoreDiv.innerText = `النتيجة: ${score} من ${questions.length}`;
        if(score === questions.length) scoreDiv.classList.add('success');
        else scoreDiv.classList.remove('success');
    }
