/**
 * Commander's Revised Martial Equipment (RME) - FoundryVTT Module
 * Based on Commander's RME v1.17.4
 */

const MODULE_ID = "rnk-commanders-rme";

Hooks.once("init", () => {
    console.log(`${MODULE_ID} | Initializing Commander's Revised Martial Equipment`);

    // Register module settings
    game.settings.register(MODULE_ID, "trainingLevel", {
        name: game.i18n?.localize(`${MODULE_ID}.settings.trainingLevel.name`) ?? "Default Training Level",
        hint: game.i18n?.localize(`${MODULE_ID}.settings.trainingLevel.hint`) ?? "Set the default training level displayed on weapon descriptions.",
        scope: "world",
        config: true,
        type: String,
        choices: {
            untrained: "Untrained",
            basic: "Basic",
            master: "Master"
        },
        default: "basic"
    });

    game.settings.register(MODULE_ID, "weaponDCFormula", {
        name: "Weapon DC Formula",
        hint: "The formula used to calculate Weapon DC. Default: 8 + proficiency + STR mod + magic bonus",
        scope: "world",
        config: true,
        type: String,
        default: "8 + @prof + @abilities.str.mod"
    });

    game.settings.register(MODULE_ID, "criticalHitRule", {
        name: "RME Critical Hit Rule",
        hint: "When enabled, critical hits maximize weapon damage dice, add ability modifier, then roll weapon damage dice again.",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE_ID, "flankingBonus", {
        name: "Flanking Bonus",
        hint: "Bonus to attack rolls when flanking. RME uses +2 for 2 flankers, +5 for 3+.",
        scope: "world",
        config: true,
        type: String,
        choices: {
            none: "Disabled",
            rme: "RME Rules (+2/+5)",
            advantage: "Advantage (Standard 5e Variant)"
        },
        default: "rme"
    });
});

Hooks.once("ready", () => {
    console.log(`${MODULE_ID} | Commander's Revised Martial Equipment ready`);

    // Notify on first load
    if (!game.settings.get(MODULE_ID, "trainingLevel")) return;

    if (game.user.isGM) {
        const packCount = game.packs.filter(p => p.metadata.packageName === MODULE_ID).length;
        if (packCount > 0) {
            console.log(`${MODULE_ID} | ${packCount} compendium packs loaded`);
        }
    }
});

// Add RME weapon group and training level flags to weapon items
Hooks.on("renderItemSheet", (app, html, data) => {
    const item = app.object;
    if (item?.type !== "weapon" && item?.type !== "equipment") return;

    const flags = item.getFlag(MODULE_ID, "rmeData");
    if (!flags) return;

    // Add RME training info to the item sheet header
    const headerEl = html.find(".sheet-header");
    if (headerEl.length && flags.group) {
        const trainingBadge = `<span class="rme-training-badge rme-${flags.trainingLevel || 'basic'}">${flags.group} - ${(flags.trainingLevel || 'basic').charAt(0).toUpperCase() + (flags.trainingLevel || 'basic').slice(1)}</span>`;
        headerEl.find(".item-subtitle").append(trainingBadge);
    }
});
