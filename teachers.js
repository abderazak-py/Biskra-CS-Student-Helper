/**
 * Teachers contact page functionality
 */

/**
 * Teachers data array
 */
const TEACHERS = [
    { name: "Ababsa Tarek", email: "tarek.ababsa@univ-biskra.dz" },
    { name: "Abdelli Belkacem", email: "abdelli.belkacem@univ-biskra.dz" },
    { name: "Almi Moufida", email: "moufida.almi@univ-biskra.dz" },
    { name: "Aloui Ahmed", email: "a.aloui@univ-biskra.dz" },
    { name: "Ayad Soheyb", email: "s.ayad@univ-biskra.dz" },
    { name: "Babahenini Djihane", email: "djihane.babahenini@univ-biskra.dz" },
    { name: "Babahenini Mohamed Chaouki", email: "mc.babahenini@univ-biskra.dz" },
    { name: "Bachir Abdelmalik", email: "abdelmalik.bachir@univ-biskra.dz" },
    { name: "Bahi Naima", email: "n.bahi@univ-biskra.dz" },
    { name: "Belaiche Hamza", email: "hamza.belaiche@univ-biskra.dz" },
    { name: "Belouaar Houcine", email: "houcine.belouaar@univ-biskra.dz" },
    { name: "Belounnar Saliha", email: "saliha.belounnar@univ-biskra.dz" },
    { name: "Ben Dahmene Asma", email: "asma.bendahmene@univ-biskra.dz" },
    { name: "Benameur Sabrina", email: "sabrina.benameur@univ-biskra.dz" },
    { name: "Benchabane Moufida", email: "m.benchabane@univ-biskra.dz" },
    { name: "Bendahmane Toufik", email: "toufik.bendahmane@univ-biskra.dz" },
    { name: "Bennoui Hammadi", email: "h.bennoui@univ-biskra.dz" },
    { name: "Benseghier Nadia", email: "nadia.benseghier@univ-biskra.dz" },
    { name: "Berghida Meryem", email: "Meryem.berghida@univ-biskra.dz" },
    { name: "Berima Salima", email: "salima.berima@univ-biskra.dz" },
    { name: "Bitam Salim", email: "s.bitam@univ-biskra.dz" },
    { name: "Boucetta Mebarek", email: "mebarek.boucetta@univ-biskra.dz" },
    { name: "Bouchana Belkacem", email: "belkacem.bouchana@univ-biskra.dz" },
    { name: "Bouguetitiche Amina", email: "amina.bouguetitiche@univ-biskra.dz" },
    { name: "Boukhlouf Djemaa", email: "djemaa.boukhlouf@univ-biskra.dz" },
    { name: "Bourekkache Samir", email: "s.bourekkache@univ-biskra.dz" },
    { name: "Cherif Foudil", email: "cherif.foudil@univ-biskra.dz" },
    { name: "Chighoub Fouzia", email: "fouzia.chighoub@univ-biskra.dz" },
    { name: "Chighoub Rabiaa", email: "rabiaa.chighoub@univ-biskra.dz" },
    { name: "Djaber Khaled", email: "khaled.djaber@univ-biskra.dz" },
    { name: "Djedi Noureddine", email: "n.djedi@univ-biskra.dz" },
    { name: "Djeffal Abdelhamid", email: "a.djeffal@univ-biskra.dz" },
    { name: "Djerou Leila", email: "l.djerou@univ-biskra.dz" },
    { name: "Fekraoui Farah", email: "Farah.fekraoui@univ-biskra.dz" },
    { name: "Guemeida Abdelbasset", email: "abdelbasset.guemeida@univ-biskra.dz" },
    { name: "Guerrouf Faycal", email: "f.guerrouf@univ-biskra.dz" },
    { name: "Hamida Ammar", email: "ammar.hamida@univ-biskra.dz" },
    { name: "Hattab Dalila", email: "d.hattab@univ-biskra.dz" },
    { name: "Hmidi Zohra", email: "zohra.hmidi@univ-biskra.dz" },
    { name: "Hoadjli Hadia", email: "hoadjli.hadia@univ-biskra.dz" },
    { name: "Houhou Okba", email: "okba.houhou@univ-biskra.dz" },
    { name: "Kahloul Laid", email: "l.kahloul@univ-biskra.dz" },
    { name: "Kalfali Toufik", email: "toufik.kalfali@univ-biskra.dz" },
    { name: "Kazar Okba", email: "o.kazar@univ-biskra.dz" },
    { name: "Kerdoudi Mohamed Lamine", email: "l.kerdoudi@univ-biskra.dz" },
    { name: "Meadi Mohamed Nadjib", email: "mohamed_nadjib.meadi@univ-biskra.dz" },
    { name: "Meklid Abdessalam", email: "abdessalam.meklid@univ-biskra.dz" },
    { name: "Merabet Rabiya", email: "rabiya.merabet@univ-biskra.dz" },
    { name: "Merizig Abdelhak", email: "a.merizig@univ-biskra.dz" },
    { name: "Mohammedi Amira", email: "amira.mohammedi@univ-biskra.dz" },
    { name: "Mokhtari Bilal", email: "bilal.mokhtari@univ-biskra.dz" },
    { name: "Mouaki Benani Nawel", email: "nawel.mouaki@univ-biskra.dz" },
    { name: "Moussaoui Manel", email: "manel.moussaoui@univ-biskra.dz" },
    { name: "Ouaar Hanane", email: "hanane.ouaar@univ-biskra.dz" },
    { name: "Rahmani Salima", email: "s.rahmani@univ-biskra.dz" },
    { name: "Rezeg Khaled", email: "k.rezeg@univ-biskra.dz" },
    { name: "Sahli Siham", email: "siham.sahli@univ-biskra.dz" },
    { name: "Sahraoui Somia", email: "somia.sahraoui@univ-biskra.dz" },
    { name: "Sihem Slatnia", email: "sihem.slatnia@univ-biskra.dz" },
    { name: "Telli Abdelmoutie", email: "a.telli@univ-biskra.dz" },
    { name: "Terrissa Sadek labib", email: "terrissa@univ-biskra.dz" },
    { name: "Tibermacine Ahmed", email: "ahmed.tibermacine@univ-biskra.dz" },
    { name: "Tibermacine Okba", email: "o.tibermacine@univ-biskra.dz" },
    { name: "Tigane Samir", email: "s.tigane@univ-biskra.dz" },
    { name: "Torki Fatima Zohra", email: "fatima.torki@univ-biskra.dz" },
    { name: "Touil Keltoum", email: "keltoum.touil@univ-biskra.dz" },
    { name: "Youkana Imene", email: "imane.youkana@univ-biskra.dz" },
    { name: "Zerari Abdelmoumen", email: "a.zerari@univ-biskra.dz" },
    { name: "Zerarka Mohamed Faouzi", email: "faouzi.zerarka@univ-biskra.dz" },
    { name: "Zernadji Tarek", email: "tarek.zernadji@univ-biskra.dz" },
    { name: "Zouioueche Amina", email: "amina.zouioueche@univ-biskra.dz" }
];

/**
 * Initializes the teachers contact page
 */
function initTeachersPage() {
    const teacherListElement = document.getElementById('teacherList');

    if (!teacherListElement) {
        console.error('Teacher list element not found (id="teacherList")');
        return;
    }

    teacherListElement.innerHTML = '';

    TEACHERS.forEach((teacher) => {
        const teacherCard = createTeacherCard(teacher);
        teacherListElement.appendChild(teacherCard);
    });
}

function createTeacherCard(teacher) {
    const card = document.createElement('div');
    card.className = 'teacher-card';

    card.innerHTML = `
    <div class="teacher-card__main">
      <div class="teacher-card__name">${teacher.name}</div>
      <div class="teacher-card__email-row">
        <span class="teacher-card__email" title="${teacher.email}">${teacher.email}</span>
        <button type="button"
                class="icon-btn copy-email-btn"
                aria-label="Copy email"
                title="Copy email"
                data-email="${teacher.email}">
          ${getCopyIconSvg()}
        </button>
      </div>
    </div>
  `;

    const copyButton = card.querySelector('.copy-email-btn');
    copyButton.addEventListener('click', () => copyEmailToClipboard(teacher.email));

    return card;
}

function getCopyIconSvg() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
         fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path fill-rule="evenodd"
            d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
    </svg>
  `;
}


/**
 * Copies the email to clipboard and shows feedback
 */
async function copyEmailToClipboard(email) {
    try {
        // Clipboard API requires secure context (https/localhost)
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(email);
            showToast(`Email copied: ${email}`);
            return;
        }

        // Fallback for non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        showToast(`Email copied: ${email}`);
    } catch (err) {
        console.error('Failed to copy email: ', err);
        alert(`Failed to copy email. Please select and copy manually:\n${email}`);
    }
}

/**
 * Shows a toast notification
 */
function showToast(message) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;

    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'var(--accent)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        zIndex: '1000',
        fontSize: '14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        maxWidth: '90%',
        wordBreak: 'break-word',
        opacity: '1',
        transition: 'opacity 0.5s ease'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/**
 * Activate teachers page rendering when:
 * - DOM is ready
 * - teachers page is already active OR becomes active later
 */
document.addEventListener('DOMContentLoaded', function () {
    const teachersPage = document.getElementById('pageteachers');

    if (!teachersPage) {
        console.warn('Teachers page element not found (id="pageteachers")');
        return;
    }

    const maybeInitTeachers = () => {
        const teacherListElement = document.getElementById('teacherList');
        if (!teacherListElement) return;

        if (teachersPage.classList.contains('active')) {
            // Only render once (keeps your original intent)
            if (teacherListElement.children.length === 0) {
                initTeachersPage();
            }
        }
    };

    // Run once in case it's already active
    maybeInitTeachers();

    // Observe future active class changes
    const observer = new MutationObserver(() => maybeInitTeachers());
    observer.observe(teachersPage, {
        attributes: true,
        attributeFilter: ['class']
    });
});
