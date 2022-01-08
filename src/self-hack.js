/** @param {NS} ns **/
export async function main(ns) {
	ns.print("hack: running script on " + ns.getHostname());
	var script = ns.getRunningScript(ns.getScriptName(), ns.getHostname(), ...ns.args);
	var data = ns.flags([
		['target', ns.getHostname()],
		['threads', script.threads],
		['moneyBearer', 8000000],
		['moneyTreshold', 0.5],
		['securityTreshold', 0.75]
	]);

	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("getServerMinSecurityLevel");
	ns.disableLog("getServerSecurityLevel");
	ns.disableLog("sleep");

	var i = 0;
	var target = data.target;
	// var hostinfo = JSON.parse(ns.read('host.txt'));

	while (true) {
		i++;
		var srvMaxMoney = ns.getServerMaxMoney(target);
		var srvAvMoney = ns.getServerMoneyAvailable(target);
		var srvMinSec = ns.getServerMinSecurityLevel(target);
		var srvCurSec = ns.getServerSecurityLevel(target);

		if (srvMaxMoney >= data.moneyBearer) {
			ns.print("hack: iteration " + i + " on server " + target);
			if (srvAvMoney >= (srvMaxMoney * data.moneyTreshold)) {
				ns.print("hack: collect money: " + srvAvMoney + "/" + srvMaxMoney);
				await ns.hack(target, { threads: data.threads });
			} else {
				ns.print("hack: grow money: " + srvAvMoney + "/" + srvMaxMoney);
				await ns.grow(target, { threads: data.threads });
			}
			if (srvCurSec >= (srvMinSec + (srvMinSec * data.securityTreshold))) {
				ns.print("hack: difficulty: " + srvCurSec + "/" + srvMinSec);
				await ns.weaken(target, { threads: data.threads });
			}
		}

		await ns.sleep(1000);
	}
}
