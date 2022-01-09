/** @param {NS} ns **/
export async function main(ns) {
    ns.print("running script " + ns.getScriptName() + " on host " + ns.getHostname());

    var selectedSetName = "small";
    var levelUpgrades = 5,
        ramUpgrades = 1,
        coreUpgrades = 1;
    if (ns.argslength == 0) {
        ns.tprint("usage: run " + ns.getScriptName() + " medium");
    }
    if (ns.args.length == 1) {
        selectedSetName = ns.args[0];
    }
    var selectedSet = sets[selectedSetName];

    ns.disableLog("disableLog");
    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("sleep");

    ns.print(selectedSet);

    while (ns.hacknet.numNodes() < selectedSet.nodes) {
        ns.hacknet.purchaseNode();
        ns.print("Node " + ns.hacknet.numNodes() + "/" + selectedSet.nodes);
        await ns.sleep(3000);
    }

    ns.tprint("all " + selectedSet.nodes + " nodes are present");
    ns.print("all " + selectedSet.nodes + " nodes are present");

    for (var i = 0; i < ns.hacknet.numNodes(); i++) {
        ns.print("Upgrade Level for Node " + i + "/" + ns.hacknet.numNodes());
        while (ns.hacknet.getNodeStats(i).level < selectedSet.level) {
            ns.print("try upgrade");
            var cost = ns.hacknet.getLevelUpgradeCost(i, levelUpgrades);
            while (getMoney(ns) < cost) {
                // ns.print("Need $" + cost + " . Have $" + getMoney(ns));
                ns.print("wait for money");
                await ns.sleep(3000);
            }
            ns.hacknet.upgradeLevel(i, levelUpgrades);
        }
    }

    ns.tprint("all nodes upgraded to level " + selectedSet.level);
    ns.print("all nodes upgraded to level " + selectedSet.level);

    for (var i = 0; i < ns.hacknet.numNodes(); i++) {
        ns.print("Upgrade RAM for Node " + i + "/" + ns.hacknet.numNodes());
        while (ns.hacknet.getNodeStats(i).ram < selectedSet.ram) {
            ns.print("try upgrade");
            var cost = ns.hacknet.getRamUpgradeCost(i, ramUpgrades);
            while (getMoney(ns) < cost) {
                // ns.print("Need $" + cost + " . Have $" + getMoney(ns));
                ns.print("wait for money");
                await ns.sleep(3000);
            }
            ns.hacknet.upgradeRam(i, ramUpgrades);
        }
    }

    ns.tprint("all nodes upgraded to " + selectedSet.ram + " gb ram");
    ns.print("all nodes upgraded to " + selectedSet.ram + " gb ram");

    for (var i = 0; i < ns.hacknet.numNodes(); i++) {
        while (ns.hacknet.getNodeStats(i).cores < selectedSet.cores) {
            var cost = ns.hacknet.getCoreUpgradeCost(i, coreUpgrades);
            while (getMoney(ns) < cost) {
                // ns.print("Need $" + cost + " . Have $" + getMoney(ns));
                await ns.sleep(3000);
            }
            ns.hacknet.upgradeCore(i, coreUpgrades);
        }
    }

    ns.tprint("all nodes upgraded to " + selectedSet.cores + " cores");
    ns.print("all nodes upgraded to " + selectedSet.cores + " cores");
}

function getMoney(ns) {
    return ns.getServerMoneyAvailable("home");
}

export const sets = {
    tiny: { nodes: 4, cores: 1, ram: 2, level: 20 },
    small: { nodes: 8, cores: 2, ram: 8, level: 60 },
    medium: { nodes: 16, cores: 3, ram: 16, level: 100 },
    large: { nodes: 20, cores: 6, ram: 32, level: 160 },
    huge: { nodes: 24, cores: 16, ram: 64, level: 200 },
    full: { nodes: 26, cores: 16, ram: 64, level: 200 },
};

export function autocomplete(args, data) {
    return ["tiny", "small", "medium", "large", "full"];
}
