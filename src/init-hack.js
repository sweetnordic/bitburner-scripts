/** @param {NS} ns **/
export async function main(ns) {
	ns.print("hack: running script on " + ns.getHostname());
	var script = ns.getRunningScript(ns.getScriptName(), ns.getHostname(), ...ns.args);
	var data = ns.flags([
		['threads', script.threads],
		['moneyBearer', 8000000],
		['moneyTreshold', 0.5],
		['securityTreshold', 0.75],
		['sleep', 1]
	]);

	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("getServerMinSecurityLevel");
	ns.disableLog("getServerSecurityLevel");
	ns.disableLog("sleep");

	var i = 0;
	var targets = JSON.parse(ns.read('targets.txt'));
	var sleepTime = ((data.sleep * 100) + (data.sleep * 10));

	while (true) {
		i++;
		for (var k = 0; k < targets.length; k++) {
			var target = targets[k];
			var srvMaxMoney = ns.getServerMaxMoney(target);
			var srvAvMoney = ns.getServerMoneyAvailable(target);
			var srvMinSec = ns.getServerMinSecurityLevel(target);
			var srvCurSec = ns.getServerSecurityLevel(target);
			if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(target) || ns.hasRootAccess(target) == false) {
				continue;
			}
			if (srvMaxMoney >= data.moneyBearer) {
				ns.print("hack: iteration " + i + " on server " + k + " " + target);
				if (srvAvMoney >= (srvMaxMoney * data.moneyTreshold)) {
					ns.print('hack: collect money ' + srvAvMoney + '/' + srvMaxMoney);
					await ns.hack(target, { threads: data.threads });
				} else {
					ns.print('hack: grow money ' + srvAvMoney + '/' + srvMaxMoney)
					await ns.grow(target, { threads: data.threads });
				}
				if (srvCurSec >= (srvMinSec + (srvMinSec * data.securityTreshold))) {
					ns.print('hack: difficulty ' + srvCurSec + '/' + srvMinSec);
					await ns.weaken(target, { threads: data.threads });
				}
				await ns.sleep(sleepTime);
			} else { continue; }
		}
	}
}
