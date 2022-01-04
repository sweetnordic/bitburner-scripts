/** @param {NS} ns **/
export async function main(ns) {
	ns.print("takeover: running script");
	var data = ns.flags([
		["home", ""]
	]);
	var network = JSON.parse(ns.read("network.txt"));

	for (var i = 0; i < network.length; i++) {
		var host = network[i];
		await teardown(ns, host.hostname);
		if (host.node == true) {
			if (await takeover(ns, host, data) != 0) {
				ns.toast("server " + host.hostname + " successful taken", "success", 2000);
			} else {
				ns.toast("server " + host.hostname + " failed to take", "warning", 2000);
			}
		}
	}

	if (data.home !== "") {
		if (ns.serverExists(data.home)) {
			if (await takeover(ns, { "hostname": "home" }, data) != 0) {
				ns.toast("server home successful started", "success", 2000);
			} else {
				ns.toast("server home failed to start", "warning", 2000);
			}
		}
	}

}

/** @param {NS} ns **/
async function teardown(ns, hostname) {

	if (ns.serverExists(hostname) === false) { return; }

	var openPorts = 0;
	ns.print('takeover: ' + hostname);
	var hostInfo = ns.getServer(hostname);

	if (hostInfo.purchasedByPlayer === false) {

		if (hostInfo.sshPortOpen === false && ns.fileExists('BruteSSH.exe', 'home')) {
			ns.print('takeover: enable ssh port');
			ns.brutessh(hostname);
			openPorts++;
		} else if (hostInfo.sshPortOpen === true) { openPorts++; }

		if (hostInfo.smtpPortOpen === false && ns.fileExists('relaySMTP.exe', 'home')) {
			ns.print('takeover: enable smtp port')
			ns.relaysmtp(hostname);
			openPorts++;
		} else if (hostInfo.smtpPortOpen === true) { openPorts++; }

		if (hostInfo.sqlPortOpen === false && ns.fileExists('SQLInject.exe', 'home')) {
			ns.print('takeover: enable sql port')
			ns.sqlinject(hostname);
			openPorts++;
		} else if (hostInfo.sqlPortOpen === true) { openPorts++; }

		if (hostInfo.ftpPortOpen === false && ns.fileExists('FTPCrack.exe', 'home')) {
			ns.print('takeover: enable ftp port')
			ns.ftpcrack(hostname);
			openPorts++;
		} else if (hostInfo.ftpPortOpen === true) { openPorts++; }

		if (hostInfo.httpPortOpen === false && ns.fileExists('HTTPWorm.exe', 'home')) {
			ns.print('takeover: enable http port')
			ns.httpworm(hostname);
			openPorts++;
		} else if (hostInfo.httpPortOpen === true) { openPorts++; }

		if (hostInfo.hasAdminRights === false && openPorts >= hostInfo.numOpenPortsRequired) {
			if (ns.getHackingLevel() >= hostInfo.requiredHackingSkill) {
				ns.print('takeover: nuke server');
				ns.nuke(hostname);
				hostInfo = ns.getServer(hostname);
			} else { return; }
		}

		// does not work now / game says later
		if (hostInfo.backdoorInstalled === false) {
			// ns.print('takeover: install backdoor')
			// await ns.installBackdoor();
		}

	}


}

/** @param {NS} ns **/
async function takeover(ns, host, data) {
	
	var pid = 0;
	var hostname = host.hostname;
	if (ns.serverExists(hostname) === false) { return pid; }

	ns.print('takeover: ' + hostname)
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
			var scriptThreads = Math.floor(hostInfo.maxRam / ns.getScriptRam(hackScript));
			pid = ns.exec(hackScript, hostname, scriptThreads, "--threads", scriptThreads);
			return pid;
		}

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
			var scriptThreads = Math.floor(hostInfo.maxRam / ns.getScriptRam(hackFile));
			// ns.tprint(hostname + ": " + scriptThreads);
			pid = ns.exec(hackFile, hostname, scriptThreads, "--threads", scriptThreads);
			return pid;
		}
		pid = 1;

	} else if (hostInfo.hasAdminRights === true && hostInfo.purchasedByPlayer === true && hostname === "home") {
		var scriptThreads = 8;
		var hostUsableRam = Math.floor((hostInfo.maxRam - (hostInfo.ramUsed + 12)));
		var scriptsRequiredRam = Math.round(((ns.getScriptRam("get-money.js") + ns.getScriptRam("grow-money.js") + ns.getScriptRam("weaken-host.js") + ns.getScriptRam("init-hack.js")) * scriptThreads));
		var scriptIterations = Math.floor((hostUsableRam / scriptsRequiredRam));
		for (var i = 0; i < scriptIterations; i++) {
			ns.exec("get-money.js", "home", scriptThreads, "--threads", scriptThreads, "--hostname", data.home, i);
			ns.exec("grow-money.js", "home", scriptThreads, "--threads", scriptThreads, "--hostname", data.home, i);
			ns.exec("weaken-host.js", "home", scriptThreads, "--threads", scriptThreads, "--hostname", data.home, i);
			ns.exec("init-hack.js", "home", scriptThreads, "--threads", scriptThreads, i)
		}
		pid = 1;
	}

	return pid;
}
