/** @param {NS} ns **/
export async function main(ns) {
	var script = ns.getRunningScript(ns.getScriptName(), ns.getHostname(), ...ns.args);
	var data = ns.flags([
		['target', 'zer0'],
		['threads', script.threads]
	]);
	if (ns.args.length == 0) {
		ns.tprint("usage: run " + ns.getScriptName() + " --target zer0 [--threads 8] -t 8");
		return;
	} else if (ns.args.length == 1) {
		data.target = ns.args[0];
	}

	var i = 0;
	while (true) {
		i++;
		ns.print(data.target + " " + i);
		await ns.weaken(data.target, { threads: data.threads });
	}
}

export function autocomplete(data, args) {
	return [...data.servers];
}
