export const RETURN_DEFAULT_ERROR = 0;
export const RETURN_DEFAULT_OK = 1;
export const RETURN_OK = 60000;
export const RETURN_HOME_OK = 60001;
export const RETURN_ALREADY_RUNNING = 60002;
export const RETURN_UNKNOWN_ERROR = 60011;
export const RETURN_SERVER_NOT_FOUND = 60012;
export const RETURN_EXEC_ERROR = 60013;
export const RETURN_NO_ADMIN_ACCESS = 60014;
export const RETURN_NOT_ENOUGH_MEMORY = 60021;
export const RETURN_NOT_ENOUGH_SKILL = 60022;

/** @param {NS} ns **/
export async function main(ns) {
    ns.print("takeover: running script");
    var home = "";
    if (ns.args.length > 0) {
        home = ns.args[0];
    }

    var network = JSON.parse(ns.read("network.txt"));

    for (var i = 0; i < network.length; i++) {
        var host = network[i];
        await teardown(ns, host.hostname);
        if (host.node == true || host.node == false) {
            handleReturnCode(ns, await takeover(ns, host), host.hostname);
        }
    }

    if (home !== "" && ns.serverExists(home)) {
        handleReturnCode(ns, await takeover(ns, { hostname: "home" }, home), "home");
    }
}

/** @param {NS} ns **/
function handleReturnCode(ns, returnCode, hostname) {
    var show = false;
    var terminal = true;
    var msg = "unknown error failed to take";
    var typ = "warning";
    switch (returnCode) {
        case RETURN_OK:
            show = true;
            terminal = true;
            msg = "started";
            typ = "success";
            break;
        case RETURN_ALREADY_RUNNING:
            show = false;
            terminal = true;
            msg = "already running";
            typ = "info";
            break;
        case RETURN_HOME_OK:
            show = true;
            terminal = true;
            msg = "started";
            typ = "success";
            break;
        case RETURN_NOT_ENOUGH_MEMORY:
            show = false;
            terminal = false;
            msg = "not enough memory";
            typ = "warning";
            break;
        case RETURN_NOT_ENOUGH_SKILL:
            show = false;
            terminal = true;
            msg = "not enough hacking skill";
            typ = "warning";
            break;
        case RETURN_NO_ADMIN_ACCESS:
            show = false;
            terminal = true;
            msg = "no admin access";
            typ = "warning";
            break;
        case RETURN_EXEC_ERROR:
            show = true;
            terminal = true;
            msg = "not able to run script";
            typ = "warning";
        case RETURN_SERVER_NOT_FOUND:
            show = false;
            terminal = false;
            msg = "server not found";
            typ = "warning";
        default:
            break;
    }
    var fullMsg = typ.toUpperCase() + ": " + hostname + " - " + msg;
    ns.print(fullMsg);
    if (terminal === true) {
        ns.tprint(fullMsg);
    }
    if (show === true) {
        ns.toast(hostname + " - " + msg, typ, 2000);
    }
}

/** @param {NS} ns **/
async function teardown(ns, hostname) {
    if (ns.serverExists(hostname) === false) {
        return;
    }

    var openPorts = 0;
    ns.print("takeover: " + hostname);
    var hostInfo = ns.getServer(hostname);

    if (hostInfo.purchasedByPlayer === false) {
        if (hostInfo.sshPortOpen === false && ns.fileExists("BruteSSH.exe", "home")) {
            ns.print("takeover: enable ssh port");
            ns.brutessh(hostname);
            openPorts++;
        } else if (hostInfo.sshPortOpen === true) {
            openPorts++;
        }

        if (hostInfo.smtpPortOpen === false && ns.fileExists("relaySMTP.exe", "home")) {
            ns.print("takeover: enable smtp port");
            ns.relaysmtp(hostname);
            openPorts++;
        } else if (hostInfo.smtpPortOpen === true) {
            openPorts++;
        }

        if (hostInfo.sqlPortOpen === false && ns.fileExists("SQLInject.exe", "home")) {
            ns.print("takeover: enable sql port");
            ns.sqlinject(hostname);
            openPorts++;
        } else if (hostInfo.sqlPortOpen === true) {
            openPorts++;
        }

        if (hostInfo.ftpPortOpen === false && ns.fileExists("FTPCrack.exe", "home")) {
            ns.print("takeover: enable ftp port");
            ns.ftpcrack(hostname);
            openPorts++;
        } else if (hostInfo.ftpPortOpen === true) {
            openPorts++;
        }

        if (hostInfo.httpPortOpen === false && ns.fileExists("HTTPWorm.exe", "home")) {
            ns.print("takeover: enable http port");
            ns.httpworm(hostname);
            openPorts++;
        } else if (hostInfo.httpPortOpen === true) {
            openPorts++;
        }

        if (hostInfo.hasAdminRights === false && openPorts >= hostInfo.numOpenPortsRequired) {
            if (ns.getHackingLevel() >= hostInfo.requiredHackingSkill) {
                ns.print("takeover: nuke server");
                ns.nuke(hostname);
                hostInfo = ns.getServer(hostname);
            } else {
                return;
            }
        }

        // does not work now / game says later
        if (hostInfo.backdoorInstalled === false) {
            ns.print("takeover: install backdoor");
            // await ns.installBackdoor();
        }
    }
}

/** @param {NS} ns **/
async function takeover(ns, host, home = "") {
    var pid = RETURN_UNKNOWN_ERROR;
    var hostname = host.hostname;
    if (ns.serverExists(hostname) === false) {
        return RETURN_SERVER_NOT_FOUND;
    }

    ns.print("takeover: " + hostname);
    var hostInfo = ns.getServer(hostname);

    if (hostInfo.hasAdminRights === true && hostInfo.purchasedByPlayer === false) {
        // Generate local hostname file
        await ns.write("host.txt", JSON.stringify(hostInfo), "w");
        await ns.scp("host.txt", "home", hostname);

        var targetsFile = "targets.txt";
        if (ns.fileExists(targetsFile, "home")) {
            await ns.scp(targetsFile, "home", hostname);
        }

        var hackScript = "self-hack.js";
        if (ns.fileExists(hackScript, "home") && ns.getHackingLevel() >= hostInfo.requiredHackingSkill) {
            await ns.scp(["init-hack.js", "self-hack.js"], "home", hostname);
            if (hostInfo.ramUsed > hostInfo.maxRam * 0.5) {
                return RETURN_ALREADY_RUNNING;
            }
            var scriptThreads = Math.floor(hostInfo.maxRam / ns.getScriptRam(hackScript));
            if (scriptThreads > 0) {
                pid = ns.exec(hackScript, hostname, scriptThreads);
                return pid != 0 ? RETURN_OK : RETURN_EXEC_ERROR;
            } else {
                return RETURN_NOT_ENOUGH_MEMORY;
            }
        }
        return RETURN_NOT_ENOUGH_SKILL;
    } else if (hostInfo.hasAdminRights === true && hostInfo.purchasedByPlayer === true && hostname != "home") {
        // Generate local hostname file
        await ns.write("host.txt", JSON.stringify(hostInfo), "w");
        await ns.scp("host.txt", "home", hostname);

        var targetsFile = "targets.txt";
        if (ns.fileExists(targetsFile, "home")) {
            await ns.scp(targetsFile, "home", hostname);
        }

        var hackFile = "init-hack.js";
        if (ns.fileExists(hackFile, "home") && ns.getHackingLevel() >= hostInfo.requiredHackingSkill) {
            await ns.scp(["init-hack.js"], "home", hostname);
            if (hostInfo.ramUsed > hostInfo.maxRam * 0.5) {
                return RETURN_ALREADY_RUNNING;
            }
            var scriptThreads = Math.floor(hostInfo.maxRam / ns.getScriptRam(hackFile));
            // ns.tprint(hostname + ": " + scriptThreads);
            if (scriptThreads > 0) {
                pid = ns.exec(hackFile, hostname, scriptThreads);
                // , "--threads", scriptThreads
                return pid != 0 ? RETURN_OK : RETURN_EXEC_ERROR;
            } else {
                return RETURN_NOT_ENOUGH_MEMORY;
            }
        }
        return RETURN_NOT_ENOUGH_SKILL;
    } else if (hostInfo.hasAdminRights === true && hostInfo.purchasedByPlayer === true && hostname === "home") {
        var reserveRam = 32;
        var scriptThreads = 128;
        var hostUsableRam = Math.floor(hostInfo.maxRam - (hostInfo.ramUsed + reserveRam));
        var scriptsRequiredRam = Math.round(
            (ns.getScriptRam("get-money.js") +
                ns.getScriptRam("grow-money.js") +
                ns.getScriptRam("weaken-host.js") +
                ns.getScriptRam("init-hack.js")) *
                scriptThreads
        );
        var scriptIterations = Math.floor(hostUsableRam / scriptsRequiredRam);
        for (var i = 0; i < scriptIterations; i++) {
            ns.exec("get-money.js", "home", scriptThreads, "--target", home, i);
            ns.exec("grow-money.js", "home", scriptThreads, "--target", home, i);
            ns.exec("weaken-host.js", "home", scriptThreads, "--target", home, i);
            ns.exec("init-hack.js", "home", scriptThreads, "--sleep", i);
            // "--threads", scriptThreads,
        }
        return RETURN_HOME_OK;
    } else if (hostInfo.hasAdminRights === false && ns.getHackingLevel() >= hostInfo.requiredHackingSkill) {
        return RETURN_NO_ADMIN_ACCESS;
    } else if (hostInfo.hasAdminRights === false && ns.getHackingLevel() < hostInfo.requiredHackingSkill) {
        return RETURN_NOT_ENOUGH_SKILL;
    }

    return RETURN_UNKNOWN_ERROR;
}

export function autocomplete(data, args) {
    return [...data.servers];
}
