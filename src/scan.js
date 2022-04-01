/** @param {NS} ns **/
export async function main(ns) {
    var network = [],
        targets = [],
        nodes = [];
    var results = list_hosts(ns);

    for (var i = 0; i < results.length; i++) {
        var info = ns.getServer(results[i]);
        var node = true,
            target = true;
        if (info.purchasedByPlayer === true || info.moneyMax == 0 || ns.getHackingLevel < info.requiredHackingSkill) {
            target = false;
        }
        if (info.maxRam == 0 || ns.getHackingLevel < info.requiredHackingSkill) {
            node = false;
        }
        if (target == true) {
            targets.push(info.hostname);
        }
        if (node == true) {
            nodes.push(info.hostname);
        }

        network.push({
            hostname: info.hostname,
            node: node,
            target: target,
            maxRam: info.maxRam,
            moneyMax: info.moneyMax,
            numOpenPortsRequired: info.numOpenPortsRequired,
            requiredHackingSkill: info.requiredHackingSkill,
            hasRootAccess: info.hasRootAccess,
        });
    }

    await ns.write("nodes.txt", JSON.stringify(nodes), "w");
    await ns.write("targets.txt", JSON.stringify(targets), "w");
    await ns.write("network.txt", JSON.stringify(network), "w");
}

/** @param {NS} ns **/
function list_hosts(ns) {
    const list = [];
    scan_host(ns, "", "home", list);
    return list;
}

/** @param {NS} ns **/
function scan_host(ns, parent, hostname, list) {
    const children = ns.scan(hostname);
    for (let child of children) {
        if (parent == child) {
            continue;
        }
        if (child == "." || child == "run4theh111z" || child == "w0r1d_d43m0n") {
            ns.tprint(parent + " => " + child);
        }
        list.push(child);
        scan_host(ns, hostname, child, list);
    }
}
