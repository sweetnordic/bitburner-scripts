/** @param {NS} ns **/
export async function main(ns) {
    let upgrade = "Sell for Money";
    let amount = "all";
    let runAsDaemon = false;
    let isChild = false;
    let isMaster = false;
    let threads = 8;
    let hostname = ns.getHostname();
    let scriptname = ns.getScriptName();

    ns.disableLog("disableLog");
    ns.disableLog("sleep");

    if (ns.args.length >= 1) {
        if (ns.args[0] != DAEMON_PARAMETER) {
            upgrade = ns.args[0];
            if (ns.args.length >= 2) {
                amount = ns.args[1];
            }
        } else {
            runAsDaemon = true;
            amount = "all";
            upgrade = "Sell for Money";
            if (ns.args.length > 1) {
                threads = ns.args[1];
                if (ns.args.length == 3) {
                    isChild = true;
                    isMaster = false;
                    ns.print("running script " + scriptname + " on host " + hostname + "as daemon child.");
                } else {
                    isMaster = true;
                    isChild = false;
                    ns.print("running script " + scriptname + " on host " + hostname + "as daemon master with " + threads + " childs.");
                }
            }
        }
    }

    if (runAsDaemon == true) {
        if (isMaster == true) {
            for (let i = 1; i <= threads; i++) {
                ns.exec(scriptname, hostname, 1, "-d", threads, i);
            }
        }
        while (true) {
            ns.hacknet.spendHashes(upgrade);
            await ns.sleep(10);
        }
    } else if (amount == AMOUNT_ALL) {
        while (ns.hacknet.spendHashes(upgrade)) {
            await ns.sleep(10);
        }
    } else {
        for (let i = 0; i < amount; i++) {
            ns.hacknet.spendHashes(upgrade);
            await ns.sleep(10);
        }
    }
}

export const AMOUNT_ALL = "all";
export const DAEMON_PARAMETER = "-d";
export const Upgrades = [
    "Sell for Money",
    "Sell for Corporation Funds",
    "Reduce Minimum Security",
    "Increase Maximum Money",
    "Improve Studying",
    "Improve Gym Training",
    "Exchange for Corporation Research",
    "Exchange for Bladeburner Rank",
    "Exchange for Bladeburner SP",
    "Generate Coding Contract",
];
