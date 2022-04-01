
/** @param {NS} ns **/
export async function main(ns) {
    ns.print("easy-crime: running script");
    let crime = "rob store";
    if (ns.args.length > 0) {
        crime = ns.args[0];
    }

    while (true) {
        await ns.sleep(1000);
        if (ns.isBusy()) {
            continue;
        }
        ns.commitCrime(crime);
        ns.tprint(`Crime ${crime} done`);
    }
}

export const crimes = ["heist", "assassination", "kidnap", "grand theft auto", "homicide", "larceny", "mug someone", "rob store", "shoplift"];

export function autocomplete(data, args) {
    return [...crimes];
}
