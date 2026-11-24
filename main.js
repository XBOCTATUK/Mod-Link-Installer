async function loadModByID(modID) {
    try {
        const res = await fetch(`https://api.geode-sdk.org/v1/mods/${modID}`);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        const modName = data.payload.versions[0].name;
        let modDevs = "";

        if (Array.isArray(data.payload.developers)) {
            const devCount = data.payload.developers.length;

            if (devCount === 1) {
                modDevs = data.payload.developers[0].display_name;
            }
            else {
                const firstModDev = data.payload.developers[0].display_name;
                modDevs = `${firstModDev} & ${devCount-1} more`;
            }
        }

        const modData = {
            name: modName,
            developers: modDevs,
            id: modID
        };
        
        return { ok: true, data: modData };
    }
    catch (error) {
        return { ok: false, error: error.message };
    }
}

function updateUI(modData) {
    const modName = document.querySelector(".mod-name");
    const modDevs = document.querySelector(".mod-developers");
    const modLogo = document.querySelector(".mod-logo");
    const geodeBtn = document.querySelector(".geode-button");
    const uriBtn = document.querySelector(".uri-button");

    modName.textContent = modData.name;
    modDevs.textContent = modData.developers;
    modLogo.src = `https://api.geode-sdk.org/v1/mods/${modData.id}/logo`;
    modLogo.hidden = false;

    geodeBtn.addEventListener("click", () => {
        window.location.href = `https://geode-sdk.org/mods/${modData.id}`;
    });
    geodeBtn.disabled = false;

    uriBtn.addEventListener("click", () => {
        window.location.href = `geode://gdm-mod-link/${modData.id}`;
    });
    uriBtn.disabled = false;
}

const params = new URLSearchParams(window.location.search);
const modID = params.get("mod");

if (modID) {
    loadModByID(modID).then(result => {
        if (result.ok) {
            updateUI(result.data);
        }
        else {
            document.querySelector(".mod-name").textContent = "Failed to load mod";
        }
    });
}
else {
    document.querySelector(".mod-name").textContent = "No mod specified";
}