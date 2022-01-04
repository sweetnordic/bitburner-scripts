/** @param {NS} ns **/
export async function main(ns) {
	ns.print('hack: running script');
	var data = ns.flags([
		['threads', 4],
		['moneyBearer', 8000000],
		['moneyTreshold', 0.5],
		['securityTreshold', 0.75]
	]);
	var i = 0;
	var hostnames = JSON.parse(ns.read('targets.txt'));
	var length = hostnames.length;
	
	while (true) {
		i++;

		for (var k = 0; k < hostnames.length; k++) {
			var host = hostnames[k];
			var srvMaxMoney = ns.getServerMaxMoney(host);
			var srvAvMoney = ns.getServerMoneyAvailable(host);
			var srvMinSec = ns.getServerMinSecurityLevel(host);
			var srvCurSec = ns.getServerSecurityLevel(host);
			if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(host) || ns.hasRootAccess(host) == false) {
				continue;
			}
			if (srvMaxMoney >= data.moneyBearer) {
				ns.print("hack: iteration " + i + " on server " + k + " " + host);
				if (srvAvMoney >= (srvMaxMoney * data.moneyTreshold)) {
					ns.print('hack: collect money ' + srvAvMoney + '/' + srvMaxMoney);
					await ns.hack(host, { threads: data.threads });
				} else {
					ns.print('hack: grow money ' + srvAvMoney + '/' + srvMaxMoney)
					await ns.grow(host, { threads: data.threads });
				}
				if (srvCurSec >= (srvMinSec + (srvMinSec * data.securityTreshold))) {
					ns.print('hack: difficulty ' + srvCurSec + '/' + srvMinSec);
					await ns.weaken(host, { threads: data.threads });
				}
				if (hostnames.length <= 2) {
					await ns.sleep(2000);
				}
			} else { continue; }
		}
	}
}