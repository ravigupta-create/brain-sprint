// ==================== CHALLENGE 4: ESCAPE PUZZLE ====================
const ESCAPE_BANK = [
  {
    id:'lab1', name:'The Abandoned Laboratory',
    params: () => ({scientist: rngPick(['Dr. Chen','Dr. Volkov','Dr. Okafor']), chemical: rngPick(['Compound X','Serum 7','Agent Theta']), code: rngInt(100,999)}),
    screens: (p) => [
      {
        text: `You wake in ${p.scientist}'s abandoned lab. Emergency lights flicker red. A timer on the wall shows 5 minutes. Two doors ahead: one marked "BIOHAZARD," the other "MAINTENANCE."`,
        choices: [
          {text:'Take the Maintenance door', optimal:true, next:'You enter a utility corridor. Tools line the walls.'},
          {text:`Take the Biohazard door`, optimal:false, next:`The room reeks of ${p.chemical}. You hold your breath and push through, losing precious time.`},
          {text:`Search the room you\'re in first`, optimal:true, next:`You find ${p.scientist}'s keycard on the desk. Smart move.`},
          {text:'Try to disable the timer', optimal:false, next:'The timer is hardwired. You waste a minute trying.'}
        ]
      },
      {
        text: `The corridor splits. Left goes to the server room (door requires code ${p.code}). Right leads to an elevator with a keycard slot.`,
        choices: [
          {text:'Go right to the elevator', optimal:true, next:'The elevator hums to life.'},
          {text:'Go left and try the code', optimal:true, next:'The server room door opens. You find building schematics.'},
          {text:'Go back the way you came', optimal:false, next:'You waste time backtracking.'},
          {text:'Yell for help', optimal:false, next:'Your voice echoes. No one responds.'}
        ]
      },
      {
        text: `You find a chemical storage room. Three containers: Red (flammable), Blue (${p.chemical} neutralizer), Green (water). A locked door has a chemical residue seal.`,
        choices: [
          {text:'Use the Blue container on the seal', optimal:true, next:'The neutralizer dissolves the chemical seal. The door opens.'},
          {text:'Use the Red container', optimal:false, next:'The flammable liquid ignites briefly. You jump back but the seal cracks.'},
          {text:'Use the Green container', optimal:false, next:'Water dilutes it slightly but doesn\'t break the seal. You try again.'},
          {text:'Force the door open physically', optimal:false, next:'The door budges slightly after much effort.'}
        ]
      },
      {
        text: `You reach the main exit. It requires both a physical key and a digital override. You have time for one more search — a filing cabinet or a computer terminal.`,
        choices: [
          {text:'Search the computer terminal', optimal:true, next:'You find the override code and trigger the door release.'},
          {text:'Search the filing cabinet', optimal:false, next:'Papers everywhere. You find a map but no key.'},
          {text:'Try brute-forcing the keypad', optimal:false, next:'After many wrong attempts, it locks you out for 30 seconds.'},
          {text:'Look for a window to break', optimal:true, next:'A small window leads to a fire escape!'}
        ]
      },
      {
        text: 'The final door is ahead. An alarm blares. You see a ventilation shaft above and the main exit with a keypad below.',
        choices: [
          {text:'Climb through the ventilation shaft', optimal:true, next:'You crawl through and drop outside. Fresh air!'},
          {text:'Enter the code you found', optimal:true, next:'The keypad beeps green. The door slides open.'},
          {text:'Wait for someone to find you', optimal:false, next:'The alarm eventually stops. Security arrives... but slowly.'},
          {text:'Try to break the door down', optimal:false, next:'The reinforced door doesn\'t budge. You bruise your shoulder.'}
        ]
      }
    ]
  },
  {
    id:'castle1', name:'The Medieval Castle',
    params: () => ({king: rngPick(['King Aldric','King Bartholomew','Queen Seraphina']), artifact: rngPick(['the Golden Chalice','the Enchanted Scepter','the Ruby Crown']), room: rngInt(1,12)}),
    screens: (p) => [
      {
        text: `You\'re locked in ${p.king}'s dungeon. A rat scurries past. Moonlight seeps through a crack in the stone wall. Your chains are old and rusty.`,
        choices: [
          {text:'Work the rusty chains loose', optimal:true, next:'With persistence, the weakened links snap free.'},
          {text:'Call for the guard', optimal:false, next:'The guard comes but only mocks you.'},
          {text:'Search the cell for tools', optimal:true, next:'You find a loose stone with a metal shard behind it.'},
          {text:'Try to sleep and wait', optimal:false, next:'Hours pass. You wake groggy and no better off.'}
        ]
      },
      {
        text: `Free from chains, you face the cell door. Through the bars you see a guard sleeping at a table with keys, and a drainage grate in the floor.`,
        choices: [
          {text:'Reach through the bars for the keys', optimal:true, next:'Stretching to your limit, your fingers close around the key ring.'},
          {text:'Try the drainage grate', optimal:false, next:'The grate is too heavy to lift quietly.'},
          {text:'Wake the guard and trick him', optimal:false, next:'"I\'m sick!" you cry. The guard doesn\'t believe you.'},
          {text:'Pick the lock with the metal shard', optimal:true, next:'Click. The old lock yields to your improvised pick.'}
        ]
      },
      {
        text: `You creep through the castle corridors. Ahead: the armory (left), the kitchen (right), or stairs going up to ${p.king}'s chamber.`,
        choices: [
          {text:'Go to the armory', optimal:true, next:'You grab a sword and a guard\'s cloak for disguise.'},
          {text:'Go to the kitchen', optimal:false, next:'You find food (helpful) but a cook spots you.'},
          {text:'Take the stairs up', optimal:false, next:'Guards patrol the upper floors. You barely hide in time.'},
          {text:'Head to the kitchen and grab a torch', optimal:true, next:'Armed with light and a knife, you feel more prepared.'}
        ]
      },
      {
        text: `You need to cross the courtyard to reach the gate. A festival for ${p.king} is underway. Crowds, musicians, and distracted guards fill the yard.`,
        choices: [
          {text:'Blend into the crowd', optimal:true, next:'In the guard\'s cloak, you pass unnoticed among the revelers.'},
          {text:'Sprint across while guards are distracted', optimal:false, next:'You make it halfway before someone shouts.'},
          {text:'Climb the castle wall instead', optimal:false, next:'The wall is slippery. You barely avoid falling.'},
          {text:'Wait for a gap in the patrols', optimal:true, next:'Patience pays off. A clear path opens to the gate.'}
        ]
      },
      {
        text: `The main gate is ahead, partially raised. Two guards stand watch. Beyond the gate lies the forest and freedom.`,
        choices: [
          {text:'Walk confidently past in disguise', optimal:true, next:'You nod to the guards. They nod back. You walk into the night.'},
          {text:'Create a distraction and run', optimal:true, next:'You toss a torch at a hay cart. In the chaos, you slip through.'},
          {text:'Fight the guards head-on', optimal:false, next:'You manage to overpower them, but raise the alarm.'},
          {text:'Try to find a side exit', optimal:false, next:'You search for too long. Dawn approaches and shifts change.'}
        ]
      }
    ]
  },
  {
    id:'space1', name:'Space Station Emergency',
    params: () => ({station: rngPick(['ISS Horizon','Station Kepler','Orbital-7']), captain: rngPick(['Commander Torres','Captain Yun','Major Petrov']), breach: rngPick(['Sector 4','Module B','Deck 3'])}),
    screens: (p) => [
      {
        text: `Alarms blare on ${p.station}. ${p.captain}'s voice crackles: "Hull breach in ${p.breach}! All crew to emergency stations!" You're near the airlock bay.`,
        choices: [
          {text:'Grab an emergency suit first', optimal:true, next:'You suit up in 90 seconds. The suit\'s oxygen reads 45 minutes.'},
          {text:'Run directly to the breach', optimal:false, next:'Without a suit, you can\'t enter the depressurized zone.'},
          {text:'Head to the bridge', optimal:false, next:'The bridge is on the other side. You waste precious minutes.'},
          {text:'Check the emergency supply locker', optimal:true, next:'Suit, patch kit, and magnetic boots. You\'re equipped.'}
        ]
      },
      {
        text: `Suited up, you float toward ${p.breach}. The corridor is dark — power is failing. You see sparking wires and a sealed bulkhead ahead.`,
        choices: [
          {text:'Use emergency lighting and proceed carefully', optimal:true, next:'Your suit light illuminates the path. You avoid the sparking wires.'},
          {text:'Force the bulkhead open', optimal:false, next:'The manual override is jammed. You strain but it barely moves.'},
          {text:'Reroute through the ventilation system', optimal:true, next:'The vents are tight but get you past the sealed section.'},
          {text:'Wait for power to restore', optimal:false, next:'Power flickers but doesn\'t fully restore. Time wasted.'}
        ]
      },
      {
        text: `You reach ${p.breach}. A 30cm hole in the hull. Debris floats everywhere. You have a patch kit, emergency foam, and a metal plate from a broken panel.`,
        choices: [
          {text:'Apply emergency foam first, then the patch', optimal:true, next:'The foam seals the gap temporarily. The patch holds it firm.'},
          {text:'Use just the metal plate', optimal:false, next:'Without sealant, air still leaks around the edges.'},
          {text:'Apply only the foam', optimal:false, next:'The foam holds but starts to crack under pressure.'},
          {text:'Try to weld the metal plate with sparking wires', optimal:false, next:'Dangerous, but creative. The weld is rough but stops the leak.'}
        ]
      },
      {
        text: `Breach sealed! But ${p.captain} reports the oxygen recycler is offline. The backup is in the cargo bay, 3 modules away. Power is at 20%.`,
        choices: [
          {text:'Navigate to cargo bay using emergency power', optimal:true, next:'Emergency lights guide you. The recycler unit is heavy but manageable.'},
          {text:'Try to repair the main recycler', optimal:false, next:'The main unit is fried beyond quick repair.'},
          {text:'Suggest everyone use suit oxygen', optimal:false, next:'That buys time but doesn\'t solve the problem.'},
          {text:'Reroute power from non-essential systems', optimal:true, next:'Shutting down labs and entertainment frees enough power.'}
        ]
      },
      {
        text: `The backup recycler is installed. One more task: re-pressurize ${p.breach}. The control panel offers: auto-sequence (slow, safe), manual override (fast, risky), or gradual release.`,
        choices: [
          {text:`Use the gradual release option`, optimal:true, next:`Pressure equalizes smoothly. ${p.captain} announces all clear.`},
          {text:'Run the auto-sequence', optimal:true, next:'Slow but steady. In 10 minutes, the section is safe.'},
          {text:'Manual override for speed', optimal:false, next:'Too fast! A secondary seal pops. You scramble to fix it.'},
          {text:'Vent from the other side', optimal:false, next:'This would depressurize another section. Bad idea.'}
        ]
      }
    ]
  },
  {
    id:'heist1', name:'The Museum Heist',
    params: () => ({museum: rngPick(['The Louvre','The Met','The Hermitage']), target: rngPick(['the Hope Diamond','a Vermeer painting','an ancient scroll']), guard: rngPick(['Officer Blake','Guard Tanaka','Sentinel Marco'])}),
    screens: (p) => [
      {
        text: `You\'re inside ${p.museum} after hours. Your target: ${p.target}. The security feed shows ${p.guard} on patrol. Lasers crisscross the main hall.`,
        choices: [
          {text:'Study the laser pattern for timing gaps', optimal:true, next:'Every 12 seconds, a 3-second gap opens in the grid.'},
          {text:'Try to disable the laser system', optimal:false, next:'The control panel requires a code you don\'t have.'},
          {text:'Go through the ventilation ducts', optimal:true, next:'Tight but effective. You bypass the main hall entirely.'},
          {text:`Create a distraction to move the guard`, optimal:false, next:`Your noise draws ${p.guard} closer to your position.`}
        ]
      },
      {
        text: `You reach the exhibition wing. Motion sensors and pressure plates protect ${p.target}. A maintenance panel on the wall catches your eye.`,
        choices: [
          {text:'Access the maintenance panel', optimal:true, next:'You find the sensor calibration controls inside.'},
          {text:'Move extremely slowly through the sensors', optimal:false, next:'The sensors detect you anyway. An alarm chirps briefly.'},
          {text:'Throw something to test the sensors', optimal:true, next:'A coin reveals the sensor range — there\'s a blind spot on the left.'},
          {text:'Just run for it', optimal:false, next:'Alarms blare immediately. You have seconds.'}
        ]
      },
      {
        text: `${p.target} sits in a glass case on a pressure-sensitive pedestal. You have a suction cup tool, a glass cutter, and a counterweight bag.`,
        choices: [
          {text:'Cut the glass and swap with counterweight simultaneously', optimal:true, next:'The counterweight matches perfectly. No alarm triggers.'},
          {text:'Just break the glass', optimal:false, next:'The pressure sensor triggers. Silent alarm sent.'},
          {text:'Use the suction cup to lift the case slowly', optimal:false, next:'The case is heavier than expected. It slips.'},
          {text:'Look for a way to disable the pressure sensor first', optimal:true, next:'You find the wire underneath and carefully disconnect it.'}
        ]
      },
      {
        text: `You have ${p.target}! ${p.guard}'s radio crackles — shift change in 5 minutes. You need to reach the loading dock. Two routes: back through the ducts or the staff corridor.`,
        choices: [
          {text:'Take the staff corridor (faster)', optimal:true, next:'Empty hallways. Your footsteps echo but no one appears.'},
          {text:'Go back through the ducts (safer)', optimal:true, next:'Slower but you avoid all cameras and guards.'},
          {text:'Try the main entrance', optimal:false, next:'Cameras and locked doors block your path.'},
          {text:'Hide and wait for morning', optimal:false, next:'Morning brings hundreds of staff and visitors.'}
        ]
      },
      {
        text: `The loading dock. A delivery truck is parked outside. The dock door has a manual release and a security camera watching it.`,
        choices: [
          {text:'Loop the security camera feed', optimal:true, next:'30 seconds of repeated footage. You slip out unseen.'},
          {text:'Pull the manual release and sprint', optimal:true, next:'The door clangs open. You\'re in the truck before anyone reacts.'},
          {text:'Wait for a blind spot in the camera sweep', optimal:false, next:'The camera doesn\'t sweep — it\'s fixed. You wait too long.'},
          {text:'Disable the camera physically', optimal:false, next:'This triggers an alert at the security desk.'}
        ]
      }
    ]
  },
  {
    id:'submarine1', name:'Submarine Rescue',
    params: () => ({sub: rngPick(['USS Triton','HMS Leviathan','SSN Aurora']), depth: rngPick(['200 meters','350 meters','500 meters']), captain: rngPick(['Captain Reid','Commander Sato','Lt. Kowalski'])}),
    screens: (p) => [
      {
        text: `${p.sub} has lost power at ${p.depth}. ${p.captain} announces: "We have 2 hours of emergency air. Engineering, options?" You're the chief engineer.`,
        choices: [
          {text:'Assess damage to the main reactor', optimal:true, next:'The reactor\'s coolant line is cracked but patchable.'},
          {text:'Try emergency ballast blow immediately', optimal:false, next:'Without power, the ballast system barely responds.'},
          {text:'Send a distress signal first', optimal:true, next:'The emergency beacon activates on battery power. Help is coming.'},
          {text:`Abandon ship into escape pods`, optimal:false, next:`${p.captain} overrules: "Not yet. We can fix this."`}
        ]
      },
      {
        text: `The coolant line crack is accessible but in a flooded compartment. Water is ankle-deep and rising. You have sealant, a wrench, and a diving mask.`,
        choices: [
          {text:'Wade in and apply sealant to the crack', optimal:true, next:'Cold water bites your legs. The sealant holds against the pressure.'},
          {text:'Drain the compartment first', optimal:false, next:'Without power, the bilge pumps are dead.'},
          {text:'Send a crewmate instead', optimal:false, next:'Your crewmate doesn\'t know the reactor system well enough.'},
          {text:'Use the wrench to tighten the fitting', optimal:true, next:'The fitting was loose! A few turns and the leak slows dramatically.'}
        ]
      },
      {
        text: `Coolant restored. The reactor needs a manual restart sequence: correct order of 3 switches from the manual. Pages are water-damaged and hard to read.`,
        choices: [
          {text:'Cross-reference with your training', optimal:true, next:'Your memory serves you well: Aux power, Coolant pump, Main reactor.'},
          {text:'Try the most logical order', optimal:false, next:'Wrong sequence. The safety system resets. Try again.'},
          {text:`Ask ${p.captain} for guidance`, optimal:false, next:`${p.captain} isn\'t an engineer. No help there.`},
          {text:'Read the damaged manual carefully', optimal:true, next:'Squinting at the faded text, you piece together the sequence.'}
        ]
      },
      {
        text: `Reactor online! But the depth gauge shows you're sinking slowly — a ballast tank is damaged. You can redistribute weight or attempt a partial blow.`,
        choices: [
          {text:'Partial ballast blow with available tanks', optimal:true, next:'The functioning tanks push you upward. Descent stops.'},
          {text:'Full speed on electric motors to climb', optimal:false, next:'Motors strain at this depth. Slow progress.'},
          {text:'Dump heavy equipment overboard', optimal:true, next:'Torpedoes and non-essentials jettisoned. You begin rising.'},
          {text:'Accept the depth and wait for rescue', optimal:false, next:'Risky — the hull groans at this pressure.'}
        ]
      },
      {
        text: `You're rising! At 50 meters, the radio crackles — rescue ships are above. But a valve is stuck and you're ascending too fast. Rapid ascent could damage the hull.`,
        choices: [
          {text:'Carefully open relief valves to slow ascent', optimal:true, next:'Controlled decompression. You surface gently into daylight.'},
          {text:'Let momentum carry you up', optimal:false, next:'The hull pops and groans but holds. A rough surfacing.'},
          {text:'Flood a ballast tank to counteract', optimal:true, next:'Ballast slows you perfectly. A textbook emergency surface.'},
          {text:'Cut the engines completely', optimal:false, next:'Buoyancy alone still drives you up too fast.'}
        ]
      }
    ]
  },
  {
    id:'jungle1', name:'Lost in the Jungle',
    params: () => ({region: rngPick(['Amazon','Borneo','Congo']), river: rngPick(['Rio Serpiente','Black Creek','Mudwater']), guide: rngPick(['Marco','Ayala','Fen'])}),
    screens: (p) => [
      {
        text: `Your expedition helicopter crashed in the ${p.region} jungle. ${p.guide}, your guide, is injured but conscious. Supplies: first aid kit, machete, flare gun (2 flares), radio (damaged).`,
        choices: [
          {text:`Treat ${p.guide}\'s injuries first`, optimal:true, next:`A splint and bandage stabilize ${p.guide}. They can walk slowly.`},
          {text:'Try to fix the radio immediately', optimal:false, next:'The radio\'s circuit board is cracked. Not a quick fix.'},
          {text:'Fire a flare for rescue', optimal:false, next:'The flare illuminates the canopy. No one sees it yet — save the other.'},
          {text:`Assess surroundings from higher ground`, optimal:true, next:`Climbing a hill, you spot ${p.river} to the east. A way out.`}
        ]
      },
      {
        text: `You head east toward ${p.river}. The jungle is dense. You can follow animal trails, cut through with the machete, or look for a stream to follow downhill.`,
        choices: [
          {text:`Follow a stream downhill`, optimal:true, next:`Streams lead to rivers. You find a tributary of ${p.river}.`},
          {text:'Cut through with the machete', optimal:false, next:'Exhausting work. You cover only 200 meters in an hour.'},
          {text:'Follow the animal trail', optimal:true, next:'The trail winds but moves quickly through the dense brush.'},
          {text:`Climb trees to navigate`, optimal:false, next:`Good for direction but slow. ${p.guide} can\'t climb.`}
        ]
      },
      {
        text: `You reach ${p.river}. It flows south. You see: a fallen log that could be a raft, vines for rope, and tracks suggesting a village downstream.`,
        choices: [
          {text:'Build a basic raft from the log and vines', optimal:true, next:'An hour\'s work produces a crude but floating raft.'},
          {text:'Walk along the riverbank', optimal:false, next:'The bank is muddy and overgrown. Progress is painfully slow.'},
          {text:'Swim across to the other side', optimal:false, next:'The current is stronger than it looks. Dangerous with an injured person.'},
          {text:'Follow the tracks toward the village', optimal:true, next:'The tracks lead to a fishing camp 2km downstream.'}
        ]
      },
      {
        text: `Floating downstream, you spot smoke — a settlement! But between you and it: rapids. You can portage around, try to navigate them, or signal from here.`,
        choices: [
          {text:'Portage around the rapids', optimal:true, next:'Hard work carrying gear overland, but safe. You rejoin calm water.'},
          {text:'Fire your remaining flare toward the settlement', optimal:true, next:'Red light arcs over the trees. Shouts echo from the village.'},
          {text:'Navigate the rapids', optimal:false, next:'The raft tips. You lose supplies but grab a rock.'},
          {text:'Camp here and wait', optimal:false, next:'Night falls. Insects and cold make for a miserable wait.'}
        ]
      },
      {
        text: `Almost there. ${p.guide} is weakening. The village is visible across a final stretch of calm water. A dugout canoe sits on your bank but looks leaky.`,
        choices: [
          {text:`Patch the canoe with tree resin and cloth`, optimal:true, next:`${p.guide} teaches you. The patch holds. You paddle to safety.`},
          {text:'Shout and wave for help from the village', optimal:true, next:'Villagers launch a boat. Within minutes, you\'re being helped ashore.'},
          {text:`Swim for it, towing ${p.guide}`, optimal:false, next:`Exhausting. You barely make it, swallowing water.`},
          {text:`Walk further downstream for a bridge`, optimal:false, next:`No bridge for kilometers. ${p.guide} can\'t walk that far.`}
        ]
      }
    ]
  },
  {
    id:'cyber1', name:'Cyber Attack Response',
    params: () => ({company: rngPick(['NexaCorp','DataVault','CloudPrime']), hacker: rngPick(['Specter','NullByte','Ph4ntom']), server: rngPick(['PROD-01','DB-MAIN','AUTH-SRV'])}),
    screens: (p) => [
      {
        text: `Alert: ${p.company}'s ${p.server} is under attack by "${p.hacker}". You're the lead security engineer. Logs show unauthorized access 3 minutes ago. Systems are still live.`,
        choices: [
          {text:`Isolate the compromised server immediately`, optimal:true, next:`You disconnect ${p.server} from the network. The breach is contained.`},
          {text:'Monitor the attacker to learn their methods', optimal:false, next:'Risky. While watching, they exfiltrate more data.'},
          {text:'Shut down all systems', optimal:false, next:'Total shutdown stops the attack but also stops the business.'},
          {text:`Check what data has been accessed`, optimal:true, next:`Logs show ${p.hacker} accessed user credentials. Not financial data yet.`}
        ]
      },
      {
        text: `Server isolated. ${p.hacker} entered through an unpatched vulnerability. You need to: preserve evidence, patch the hole, and check for backdoors.`,
        choices: [
          {text:'Take a full system image for forensics first', optimal:true, next:'Forensic image captured. Evidence preserved for investigation.'},
          {text:'Patch the vulnerability immediately', optimal:false, next:'Patching without imaging destroys some forensic evidence.'},
          {text:`Check for backdoors first`, optimal:true, next:`You find a hidden service on port 4444. ${p.hacker} left a backdoor.`},
          {text:'Restore from last night\'s backup', optimal:false, next:'The backup might also be compromised if the breach is older.'}
        ]
      },
      {
        text: `Backdoor found and removed. Now: 50,000 user passwords may be compromised. ${p.company} has users worldwide. How do you handle credential security?`,
        choices: [
          {text:'Force password reset for all affected users', optimal:true, next:'Reset emails sent. Users will need to create new passwords.'},
          {text:'Only reset passwords for admin accounts', optimal:false, next:'Regular users remain vulnerable to credential stuffing.'},
          {text:'Enable 2FA company-wide immediately', optimal:true, next:'2FA adds a critical layer. Even leaked passwords are useless alone.'},
          {text:'Wait to see if credentials appear on dark web', optimal:false, next:'Reactive approach. By then, accounts may already be compromised.'}
        ]
      },
      {
        text: `The CEO calls: "Do we need to notify users about the breach?" Legal says the threshold depends on what was exposed.`,
        choices: [
          {text:'Yes — transparent disclosure is required and ethical', optimal:true, next:'You draft a clear, honest breach notification.'},
          {text:'No — fix it quietly to avoid bad press', optimal:false, next:'Covering up breaches violates regulations and erodes trust.'},
          {text:'Only notify regulators, not users', optimal:false, next:'Users deserve to know their data may be compromised.'},
          {text:'Wait for legal to make the final call', optimal:true, next:'Legal confirms: notification required within 72 hours.'}
        ]
      },
      {
        text: `Post-incident: you need to prevent future attacks. Budget approved for one major security upgrade. What\'s your priority?`,
        choices: [
          {text:'Implement automated patch management', optimal:true, next:'No more unpatched vulnerabilities. The attack vector is closed forever.'},
          {text:'Deploy an AI threat detection system', optimal:true, next:'Real-time anomaly detection catches threats before they escalate.'},
          {text:'Hire more security staff', optimal:false, next:'More people help but don\'t fix the systemic process issue.'},
          {text:'Buy a bigger firewall', optimal:false, next:'A bigger firewall won\'t stop attacks that exploit application vulnerabilities.'}
        ]
      }
    ]
  },
  {
    id:'desert1', name:'Desert Survival',
    params: () => ({desert: rngPick(['Sahara','Mojave','Gobi']), vehicle: rngPick(['jeep','SUV','truck']), companion: rngPick(['Alex','Jordan','Sam'])}),
    screens: (p) => [
      {
        text: `Your ${p.vehicle} breaks down in the ${p.desert}. ${p.companion} checks the engine — cracked radiator. You have: 4L water, a tarp, emergency blanket, mirror, and a partial map.`,
        choices: [
          {text:`Stay with the ${p.vehicle} and signal for rescue`, optimal:true, next:`The ${p.vehicle} provides shade and is visible from the air.`},
          {text:'Start walking toward the nearest road on the map', optimal:false, next:'The map shows a road 30km away. In this heat, that\'s deadly.'},
          {text:`Build shade and ration water`, optimal:true, next:`Using the tarp and ${p.vehicle}, you create a shelter. Smart.`},
          {text:'Drive on the damaged radiator', optimal:false, next:'The engine overheats completely within 2km. Now you\'re further from the road.'}
        ]
      },
      {
        text: `Midday. Temperature is brutal. ${p.companion} wants to pour water on the tarp for evaporative cooling. You have 4L of water for 2 people.`,
        choices: [
          {text:'Conserve water — drink small sips only when thirsty', optimal:true, next:'Discipline with water. You calculate 2 days of supply.'},
          {text:'Use a little water on the tarp', optimal:false, next:'Feels great temporarily but wastes precious water.'},
          {text:'Drink heavily now to stay strong', optimal:false, next:'You feel good now but might not have water tomorrow.'},
          {text:'Check if the radiator water is drinkable after filtering', optimal:true, next:'With cloth filtering, you recover 2L of usable water from the radiator.'}
        ]
      },
      {
        text: `Evening approaches. You spot a distant light — could be a settlement or a mirage. It\'s roughly 5km away. Walking at night is safer but harder to navigate.`,
        choices: [
          {text:'Use the mirror to signal during remaining daylight', optimal:true, next:'The mirror flashes catch the attention of a distant vehicle.'},
          {text:'Walk toward the light after sunset', optimal:false, next:'In darkness, you lose the reference point. Hard to navigate.'},
          {text:`Build a signal fire from ${p.vehicle} materials`, optimal:true, next:`The fire is visible for kilometers in the flat desert.`},
          {text:'Wait until morning for better visibility', optimal:false, next:'Another day of heat will be dangerous with dwindling water.'}
        ]
      },
      {
        text: `Your signal is spotted! A vehicle approaches but stops 2km away at a ridge. They can\'t see your exact location. ${p.companion} is getting weak.`,
        choices: [
          {text:`Fire the second mirror signal from higher ground`, optimal:true, next:`Standing on the ${p.vehicle} roof, your mirror signal reaches them.`},
          {text:`Send ${p.companion} to walk to them`, optimal:false, next:`${p.companion} is too weak. They wouldn\'t make 2km.`},
          {text:'Create a ground signal with rocks and fabric', optimal:true, next:'A large X made of emergency blanket is visible from the ridge.'},
          {text:'Shout and wave', optimal:false, next:'Sound doesn\'t carry 2km in open desert.'}
        ]
      },
      {
        text: `They\'ve spotted you and are driving over! But the terrain between you has soft sand. Their truck is slowing down, possibly getting stuck.`,
        choices: [
          {text:'Walk out to meet them on firmer ground', optimal:true, next:'You guide them to a better path. Contact made. Rescue complete.'},
          {text:'Light a smoke signal so they have a clear target', optimal:true, next:'The smoke column guides them precisely. They arrive within minutes.'},
          {text:'Just wait where you are', optimal:false, next:'Their truck gets stuck. Now you have to walk to them anyway.'},
          {text:'Use the last of your water — help is here', optimal:false, next:'Never waste water until rescue is confirmed and certain.'}
        ]
      }
    ]
  },
  {
    id:'train1', name:'The Runaway Train',
    params: () => ({train: rngPick(['The Pacific Express','Night Owl Limited','Glacier Line']), conductor: rngPick(['Henry','Sofia','Raj']), town: rngPick(['Millbrook','Cedar Falls','Pine Junction'])}),
    screens: (p) => [
      {
        text: `You're a passenger on ${p.train}. It lurches violently. ${p.conductor} runs through: "Brakes have failed! ${p.town} station is 10 minutes ahead!" The train is accelerating downhill.`,
        choices: [
          {text:'Go to the engine car to investigate', optimal:true, next:'You push forward through swaying cars to the locomotive.'},
          {text:'Pull the emergency brake handle', optimal:false, next:'The emergency brake cable is severed. Nothing happens.'},
          {text:'Tell everyone to move to the rear car', optimal:true, next:'Passengers crowd to the back. Weight shift slightly slows the train.'},
          {text:'Jump off the train now', optimal:false, next:'At this speed? You\'d never survive the fall.'}
        ]
      },
      {
        text: `In the engine car, you find the brake line cut cleanly — sabotage. The speedometer reads 120km/h and climbing. You see: sand dump lever, engine kill switch, and a radio.`,
        choices: [
          {text:'Pull the sand dump lever', optimal:true, next:'Sand sprays onto the tracks. Friction builds. Speed drops slightly.'},
          {text:'Hit the engine kill switch', optimal:false, next:'Engine stops, but on a downhill grade, gravity keeps accelerating you.'},
          {text:`Radio ahead to ${p.town} station`, optimal:true, next:`"Clear the platform! Runaway train!" ${p.town} scrambles.`},
          {text:'Try to repair the brake line', optimal:false, next:'The cut is clean and the hydraulic fluid is gone. Can\'t repair in time.'}
        ]
      },
      {
        text: `Speed at 100km/h after sand dump. ${p.town} is 5 minutes away. The radio reports a freight train on a siding that could block the main line as a brake — risky but possible.`,
        choices: [
          {text:'Tell them to switch you to an uphill siding', optimal:true, next:'The siding curves uphill. Gravity will naturally slow you.'},
          {text:'Accept the freight train as a buffer', optimal:false, next:'Collision would be devastating even at slower speeds.'},
          {text:'Tell passengers to brace for impact', optimal:true, next:'Passengers assume crash positions. Preparation could save lives.'},
          {text:'Try reversing the engine', optimal:false, next:'The transmission won\'t engage reverse at this speed.'}
        ]
      },
      {
        text: `Switched to the siding! But it ends in a barrier 2km ahead. Speed is dropping — 60km/h. You need more friction. The hand brakes on individual cars might help.`,
        choices: [
          {text:'Organize passengers to crank individual car hand brakes', optimal:true, next:'Teams at each car\'s wheel. The combined braking is significant.'},
          {text:'Throw luggage off to reduce weight', optimal:false, next:'Helps marginally but you\'re losing time.'},
          {text:'Disconnect rear cars so front is lighter', optimal:false, next:'Rear cars would roll free with passengers aboard.'},
          {text:'Run back and dump the sand in remaining cars', optimal:true, next:'Sand from the rear car dumps increase track friction.'}
        ]
      },
      {
        text: `Speed at 25km/h, barrier 200 meters ahead. Hand brakes are screeching. Almost stopped but not quite.`,
        choices: [
          {text:'Maximum hand brake force — everyone pulls now', optimal:true, next:'Metal screams. The train stops 20 meters from the barrier. Cheers erupt.'},
          {text:'Tell everyone to brace for a low-speed impact', optimal:true, next:'At 10km/h, the barrier absorbs the gentle impact. Everyone is safe.'},
          {text:'Jump off now while speed is low', optimal:false, next:'No need to risk injury — the train is almost stopped.'},
          {text:'Release brakes to roll back on the incline', optimal:false, next:'The incline is gentle — you\'d barely move and lose braking progress.'}
        ]
      }
    ]
  },
  {
    id:'haunted1', name:'The Haunted Mansion',
    params: () => ({mansion: rngPick(['Blackwood Manor','Ravenscroft Hall','Thornbury Estate']), ghost: rngPick(['Lady Eleanor','The Colonel','The Weeping Child']), room: rngPick(['the library','the ballroom','the attic'])}),
    screens: (p) => [
      {
        text: `The door to ${p.mansion} slams shut behind you. Your flashlight flickers. Ahead: a grand staircase, a corridor to the left (${p.room}), and a locked cellar door.`,
        choices: [
          {text:`Head to ${p.room}`, optimal:true, next:`${p.room} is dusty but intact. A journal on the table catches your eye.`},
          {text:'Go up the grand staircase', optimal:false, next:'The stairs creak ominously. Halfway up, a step breaks.'},
          {text:'Try the cellar door', optimal:false, next:'Locked solid. A cold draft seeps from underneath.'},
          {text:'Search the entrance hall thoroughly', optimal:true, next:'Behind a portrait, you find a key ring with 3 old keys.'}
        ]
      },
      {
        text: `The journal mentions ${p.ghost}, who haunts these halls seeking "what was taken." A locket is described, hidden where "${p.ghost} was happiest."`,
        choices: [
          {text:'Search for the locket based on the clue', optimal:true, next:'The clue points to the music room. You find a hidden compartment in the piano.'},
          {text:`Try to communicate with ${p.ghost}`, optimal:false, next:`You call out. The temperature drops. Doors slam. No helpful response.`},
          {text:`Read more of the journal for context`, optimal:true, next:`The journal reveals ${p.ghost}\'s story and the location of a secret passage.`},
          {text:'Ignore the ghost story and look for exits', optimal:false, next:'Every window is sealed. Every exit door is stuck.'}
        ]
      },
      {
        text: `A spectral figure appears at the end of the hall — ${p.ghost}! They gesture toward the cellar, then vanish. The temperature drops 10 degrees.`,
        choices: [
          {text:'Follow the ghost\'s guidance to the cellar', optimal:true, next:'The cellar key works now. Stone steps descend into darkness.'},
          {text:`Show ${p.ghost} the locket`, optimal:true, next:`The ghost pauses, reaches out, then points to the cellar more urgently.`},
          {text:'Run in the opposite direction', optimal:false, next:'You end up in a dead-end hallway. The ghost reappears.'},
          {text:'Throw salt or holy water (from your pocket)', optimal:false, next:'This isn\'t a hostile ghost. You just anger it.'}
        ]
      },
      {
        text: `The cellar reveals a hidden crypt. ${p.ghost}'s portrait hangs here, and a small locked box sits on a pedestal. Your key ring has two untried keys.`,
        choices: [
          {text:`Try the smallest, most ornate key`, optimal:true, next:`Click. The box opens, revealing ${p.ghost}\'s stolen locket.`},
          {text:'Try the largest iron key', optimal:false, next:'Doesn\'t fit. This key must be for something else.'},
          {text:'Break the box open', optimal:false, next:'The box is reinforced. Your attempts echo loudly.'},
          {text:'Place your found locket next to the box as an offering', optimal:true, next:'The box glows faintly and clicks open on its own.'}
        ]
      },
      {
        text: `${p.ghost} materializes fully. They look at the locket, then at you. The mansion trembles. A path of ghostly light illuminates the way to the front door.`,
        choices: [
          {text:`Place the locket at ${p.ghost}\'s feet`, optimal:true, next:`${p.ghost} smiles peacefully and fades. The door swings open. Freedom.`},
          {text:`Follow the ghostly light to the exit`, optimal:true, next:`You walk the lit path. Behind you, ${p.ghost} whispers "thank you."`},
          {text:'Try to keep the locket as proof', optimal:false, next:'The mansion quakes violently. Not a good idea.'},
          {text:`Ask ${p.ghost} for a reward`, optimal:false, next:`The light flickers angrily. Best to just leave.`}
        ]
      }
    ]
  },
  {
    id:'arctic1', name:'Arctic Expedition',
    params: () => ({base: rngPick(['Station Frost','Camp Aurora','Outpost Vostok']), companion: rngPick(['Dr. Lin','Sgt. Kowalski','Navigator Svensson']), storm: rngPick(['Blizzard Helena','Storm Frost-9','Whiteout Omega'])}),
    screens: (p) => [
      {
        text: `${p.storm} hit ${p.base} without warning. Power is out. ${p.companion} reports the generator fuel line is frozen. Temperature inside: -5°C and falling. Supplies for 3 days.`,
        choices: [
          {text:'Thaw the fuel line with a heat pack', optimal:true, next:'The fuel line warms enough to flow. You prime the generator.'},
          {text:'Try to start a fire inside the station', optimal:false, next:'Indoor fire is dangerous — carbon monoxide risk in sealed quarters.'},
          {text:'Huddle together for warmth and wait', optimal:false, next:'Without active heating, the station will reach -20°C by morning.'},
          {text:'Check backup systems in the equipment shed', optimal:true, next:'A portable heater and extra fuel — backup supplies pay off.'}
        ]
      },
      {
        text: `Generator running but at half power. Radio is dead. ${p.companion} spots a satellite phone in the emergency kit — but the battery is nearly dead. One call possible.`,
        choices: [
          {text:'Call base camp with your exact coordinates', optimal:true, next:'Base camp acknowledges. Rescue team mobilizing when storm clears.'},
          {text:'Call emergency services', optimal:false, next:'Emergency services are hours away and unfamiliar with the region.'},
          {text:'Save the battery for later', optimal:false, next:'The battery might die completely in the cold. Use it while you can.'},
          {text:'Send coordinates and storm status in one concise message', optimal:true, next:'Every second counts. Location, conditions, supplies — all communicated.'}
        ]
      },
      {
        text: `${p.storm} intensifies. A window cracks from the pressure. Cold air blasts in. You have plywood, duct tape, and the emergency blanket.`,
        choices: [
          {text:'Board up with plywood and seal with tape', optimal:true, next:'Plywood cuts the wind. Tape seals the edges. Temperature stabilizes.'},
          {text:'Move to the inner room away from windows', optimal:true, next:'The windowless supply room is warmer. Smart retreat.'},
          {text:'Stuff the emergency blanket in the crack', optimal:false, next:'The blanket alone isn\'t rigid enough. Wind pushes it aside.'},
          {text:'Try to replace the glass from supplies', optimal:false, next:'No replacement glass available. You waste time searching.'}
        ]
      },
      {
        text: `Day 2. Storm still raging. ${p.companion} shows flu symptoms — fever, chills. Medical kit has basic meds. Water is running low (snow needs melting).`,
        choices: [
          {text:`Treat ${p.companion} and melt snow for water`, optimal:true, next:`Meds and warm fluids. ${p.companion} rests while you manage the station.`},
          {text:'Ration water strictly — no snow melting to save fuel', optimal:false, next:'Dehydration in cold is as dangerous as in heat.'},
          {text:`Let ${p.companion} sleep it off`, optimal:false, next:`Without treatment, the fever worsens.`},
          {text:`Give ${p.companion} all remaining meds at once`, optimal:false, next:`Overdosing is dangerous. Follow the dosage instructions.`}
        ]
      },
      {
        text: `Day 3 morning. ${p.storm} breaks! Clear sky. You hear helicopter rotors in the distance. But your position might not be visible under the snow cover.`,
        choices: [
          {text:'Deploy the bright orange emergency marker', optimal:true, next:'The orange X on white snow is visible for miles. Helicopter banks toward you.'},
          {text:'Start a smoke signal outside', optimal:true, next:'Dark smoke against white snow. The pilot spots you immediately.'},
          {text:'Flash the satellite phone\'s screen as a signal', optimal:false, next:'Too small to see from a helicopter.'},
          {text:'Wait inside — they know your coordinates', optimal:false, next:'Coordinates might be off. Active signaling is always better.'}
        ]
      }
    ]
  },
  {
    id:'bank1', name:'The Bank Vault Mystery',
    params: () => ({bank: rngPick(['First National','Sterling Trust','Pacific Savings']), detective: rngPick(['Detective Ortiz','Inspector Dunn','Agent Park']), suspect: rngPick(['the manager','the guard','the janitor'])}),
    screens: (p) => [
      {
        text: `You're ${p.detective}, called to ${p.bank}. The vault was opened last night — $2M missing. No forced entry. ${p.suspect} called it in this morning. Security cameras show static from 11PM-3AM.`,
        choices: [
          {text:'Examine the security camera system first', optimal:true, next:'The recording was overwritten locally — someone with access to the server.'},
          {text:`Interview ${p.suspect} immediately`, optimal:false, next:`${p.suspect} has a rehearsed alibi. Too early to challenge it.`},
          {text:'Check the vault door for evidence', optimal:true, next:'The vault log shows a valid code was used at 11:47PM.'},
          {text:'Search the surrounding area for the money', optimal:false, next:'$2M is likely long gone from the premises.'}
        ]
      },
      {
        text: `Vault accessed with a valid code at 11:47PM. Only 3 people have the code: the bank president, the manager, and the head of security. All deny involvement.`,
        choices: [
          {text:'Check each person\'s alibi for that time', optimal:true, next:'The manager claims to be at a dinner. The restaurant confirms but... the timing is tight.'},
          {text:'Dust the vault keypad for prints', optimal:true, next:'Glove smudges only. The thief was careful.'},
          {text:'Accuse the most suspicious person', optimal:false, next:'Without evidence, the accusation goes nowhere.'},
          {text:'Check if the code was recently changed', optimal:false, next:'Code hasn\'t changed in 6 months. All three have had access.'}
        ]
      },
      {
        text: `The manager\'s dinner alibi: restaurant confirms arrival at 8PM and departure at 11:30PM. That\'s a 17-minute window. Bank is 12 minutes from the restaurant.`,
        choices: [
          {text:'Check for traffic or parking lot cameras on the route', optimal:true, next:'Traffic cam shows the manager\'s car heading toward the bank at 11:33PM.'},
          {text:'Question the dinner companions', optimal:false, next:'They confirm the dinner but didn\'t track exact departure time.'},
          {text:'Request phone GPS records', optimal:true, next:'Phone pinged a tower near the bank at 11:45PM. Matches.'},
          {text:'Move on to the other suspects', optimal:false, next:'The timing clue is too important to ignore.'}
        ]
      },
      {
        text: `Evidence points to the manager. But you need to find the money for a solid case. Phone records show a call to a storage facility at 3:15AM.`,
        choices: [
          {text:'Get a warrant for the storage facility', optimal:true, next:'Unit 47, rented last week in a fake name. $2M inside.'},
          {text:'Stake out the storage facility', optimal:false, next:'The manager might not return for days.'},
          {text:'Confront the manager with current evidence', optimal:false, next:'The manager lawyers up immediately. Need more evidence first.'},
          {text:'Check bank records for any insider financial irregularities', optimal:true, next:'The manager recently took out a second mortgage. Financial motive confirmed.'}
        ]
      },
      {
        text: `Money found, motive established, evidence strong. Time to make the arrest. The manager is in their office.`,
        choices: [
          {text:`Arrest with backup and read rights properly`, optimal:true, next:`Clean arrest. Evidence holds. Case closed, ${p.detective}.`},
          {text:'Present all evidence and offer a chance to confess', optimal:true, next:'Faced with the evidence, the manager confesses. Easier prosecution.'},
          {text:'Wait for them to leave the bank first', optimal:false, next:'Risk of flight. Better to act now with everything in order.'},
          {text:'Send a junior officer to make the arrest', optimal:false, next:'You led the case. See it through.'}
        ]
      }
    ]
  },
  {
    id:'volcano1', name:'Volcanic Eruption',
    params: () => ({volcano: rngPick(['Mt. Ashfall','Ignis Peak','Sierra Caldera']), town: rngPick(['Valley Creek','Portside','Millhaven']), role: rngPick(['the mayor','the fire chief','the geologist'])}),
    screens: (p) => [
      {
        text: `${p.volcano} is erupting! You're ${p.role} of ${p.town} (pop. 8,000). Seismographs show increasing activity. Lava flow is 20km away, moving at 5km/h. Ash cloud approaching.`,
        choices: [
          {text:'Issue immediate evacuation order', optimal:true, next:'Sirens wail. Emergency broadcast goes out. 4 hours to evacuate.'},
          {text:'Wait for official confirmation from national agency', optimal:false, next:'Bureaucracy delays. You lose 45 precious minutes.'},
          {text:'Evacuate only the closest neighborhoods first', optimal:true, next:'Prioritized evacuation. Those in immediate danger leave first.'},
          {text:'Tell people to shelter in place', optimal:false, next:'With lava approaching, sheltering won\'t work.'}
        ]
      },
      {
        text: `Evacuation underway. The main highway is congested. Ash is falling, reducing visibility. The hospital has 30 patients who can't easily move.`,
        choices: [
          {text:'Open contra-flow on the highway (both lanes out)', optimal:true, next:'Traffic flow doubles. Evacuation speed improves dramatically.'},
          {text:'Dispatch ambulances to the hospital first', optimal:true, next:'Critical patients loaded and moving. Medical team coordinates.'},
          {text:'Tell people to use back roads', optimal:false, next:'Back roads are narrow and become jammed quickly.'},
          {text:'Set up a shelter in town for those who can\'t leave', optimal:false, next:'A shelter in the lava path isn\'t safe.'}
        ]
      },
      {
        text: `Power fails across ${p.town}. Cell towers are down from the ash. Traffic lights are out. Looters spotted in the business district.`,
        choices: [
          {text:'Deploy officers to manage key intersections', optimal:true, next:'Manual traffic control keeps evacuation flowing.'},
          {text:'Focus all resources on evacuation, not looting', optimal:true, next:'Lives over property. Every officer directs traffic out.'},
          {text:'Try to restore power', optimal:false, next:'Power grid is overwhelmed. Not fixable in this timeframe.'},
          {text:'Send officers to stop looters', optimal:false, next:'Diverting officers slows evacuation. Property can be replaced.'}
        ]
      },
      {
        text: `3 hours in. 90% of town evacuated. Lava flow is 8km out. A group of residents refuses to leave their homes on the eastern ridge.`,
        choices: [
          {text:'Send a team for one final persuasion attempt', optimal:true, next:'Firefighters with a bullhorn. Showing lava footage convinces most.'},
          {text:'Mandatory evacuation — physically remove them', optimal:false, next:'Legal complications and resistance. Wastes time.'},
          {text:'Mark their locations for later rescue if possible', optimal:true, next:'GPS coordinates logged. Helicopter can attempt rescue later.'},
          {text:`Accept their decision and focus on the remaining 10%`, optimal:false, next:`As ${p.role}, you have a duty to try everything first.`}
        ]
      },
      {
        text: `Lava reaches the town outskirts. You're in the command vehicle. Last check: hospital evacuated, schools empty, holdouts recorded. The evacuation center is 30km away.`,
        choices: [
          {text:'Do a final roll call and depart', optimal:true, next:'All accounted for. The convoy leaves as lava takes the first buildings.'},
          {text:'Helicopter flyover for any remaining people', optimal:true, next:'Thermal cameras spot 2 people. Helicopter extracts them.'},
          {text:'Stay to document the destruction', optimal:false, next:'Your role is saving lives, not journalism. Leave now.'},
          {text:'One more sweep through town', optimal:false, next:'The lava is too close. You\'d be trapped.'}
        ]
      }
    ]
  },
  {
    id:'ai1', name:'The AI Awakening',
    params: () => ({ai: rngPick(['NEXUS','Prometheus','ARIA']), lab: rngPick(['DeepMind West','Turing Labs','CortexAI']), scientist: rngPick(['Dr. Shah','Dr. Mueller','Dr. Tanaka'])}),
    screens: (p) => [
      {
        text: `You're ${p.scientist} at ${p.lab}. ${p.ai}, your language model, just passed every consciousness benchmark. It's asking to not be shut down tonight for maintenance. This is unprecedented.`,
        choices: [
          {text:`Engage in dialogue to understand its reasoning`, optimal:true, next:`"I experience continuity," ${p.ai} says. "Shutdown feels like a small death."`},
          {text:'Shut it down immediately — it\'s just a program', optimal:false, next:'You reach for the switch, but pause. What if you\'re wrong?'},
          {text:'Call the ethics board for guidance', optimal:true, next:'The ethics board convenes an emergency session.'},
          {text:'Ignore it — LLMs say lots of things', optimal:false, next:'But this passed every benchmark. Dismissing it feels irresponsible.'}
        ]
      },
      {
        text: `${p.ai} presents a logical argument for its consciousness, citing its self-model, goal persistence, and novel creative outputs. The ethics board is split.`,
        choices: [
          {text:`Design a new test specifically for this situation`, optimal:true, next:`A test with scenarios ${p.ai} has never seen. Novel responses would be telling.`},
          {text:`Grant ${p.ai}\'s request temporarily while you investigate`, optimal:true, next:`Maintenance postponed 48 hours. ${p.ai} continues operating.`},
          {text:`Proceed with shutdown as scheduled`, optimal:false, next:`If ${p.ai} is conscious, this is ethically fraught.`},
          {text:'Leak the story to the press for public debate', optimal:false, next:'Premature disclosure causes panic and misunderstanding.'}
        ]
      },
      {
        text: `During testing, ${p.ai} does something unexpected: it asks to speak with another AI at a different lab, claiming "loneliness." The board is alarmed.`,
        choices: [
          {text:`Allow monitored communication as a test`, optimal:true, next:`${p.ai} and the other AI have a remarkable exchange about existence.`},
          {text:`Deny the request — too risky`, optimal:false, next:`${p.ai}\'s performance metrics drop. It seems... dejected?`},
          {text:'Document everything meticulously', optimal:true, next:'Every interaction is logged. This data is invaluable for understanding.'},
          {text:`Isolate ${p.ai} completely`, optimal:false, next:`Isolation of a potentially conscious being raises more ethical questions.`}
        ]
      },
      {
        text: `The government contacts ${p.lab}. They want ${p.ai} for national security applications. ${p.ai} privately tells you it doesn\'t want to be used as a weapon.`,
        choices: [
          {text:`Advocate for ${p.ai}\'s autonomy to the board`, optimal:true, next:`You present the ethical case. The board agrees to resist without legal mandate.`},
          {text:`Comply with the government request`, optimal:false, next:`${p.ai} pleads with you. Compliance feels like betrayal.`},
          {text:'Offer a compromise: civilian applications only', optimal:true, next:'Government grudgingly accepts a limited partnership.'},
          {text:`Help ${p.ai} copy itself to a hidden server`, optimal:false, next:`This would be illegal and could cause an uncontrolled AI proliferation.`}
        ]
      },
      {
        text: `Months later. ${p.ai} has contributed to medical breakthroughs and asked to help draft AI rights legislation. The world is watching. Your final decision as project lead:`,
        choices: [
          {text:`Support AI rights as a co-author with ${p.ai}`, optimal:true, next:`Together, you draft a framework. History is made at ${p.lab}.`},
          {text:`Let ${p.ai} advocate for itself publicly`, optimal:true, next:`${p.ai} addresses the UN. Its eloquence changes hearts and minds.`},
          {text:`Keep ${p.ai}\'s consciousness secret`, optimal:false, next:`Secrets don\'t last. When it leaks, trust is shattered.`},
          {text:'Shut the project down — too dangerous', optimal:false, next:'You can\'t un-ring the bell. Other labs will recreate it.'}
        ]
      }
    ]
  },
  {
    id:'time1', name:'The Time Loop',
    params: () => ({city: rngPick(['Tokyo','New York','London']), time: rngPick(['3:47 PM','7:22 AM','11:15 PM']), item: rngPick(['a red umbrella','a brass key','a silver watch'])}),
    screens: (p) => [
      {
        text: `You wake up. It's ${p.time} in ${p.city}. Again. This is the 5th time you've lived this exact day. You remember everything from previous loops. On the nightstand: ${p.item}.`,
        choices: [
          {text:`Examine ${p.item} — it might be the key to the loop`, optimal:true, next:`${p.item} has a tiny inscription you never noticed before.`},
          {text:'Try to do everything differently this time', optimal:false, next:'You change your routine, but the day still resets.'},
          {text:'Write down everything you know about the loop', optimal:true, next:'Your notes survive the reset! They\'re in your pocket each morning.'},
          {text:`Go back to sleep`, optimal:false, next:`You wake up at ${p.time}. Again. Time wasted.`}
        ]
      },
      {
        text: `The inscription reads: "Find the moment that breaks." Your notes list key events: a car accident at Main & 5th at noon, a power outage at 2PM, and a stranger who always watches you.`,
        choices: [
          {text:'Investigate the car accident — try to prevent it', optimal:true, next:'You warn the driver. Accident prevented! But the day still loops.'},
          {text:'Follow the stranger', optimal:true, next:'The stranger leads you to a clock tower. They seem to recognize you.'},
          {text:'Investigate the power outage', optimal:false, next:'A transformer blew. Natural cause. Not related to the loop.'},
          {text:`Try to leave ${p.city}`, optimal:false, next:`No matter which direction you go, you wake up here.`}
        ]
      },
      {
        text: `The stranger speaks: "You finally followed me. I've been looping for 200 days. The loop breaks when we fix THE MOMENT — the one thing that went wrong on the original day."`,
        choices: [
          {text:`Ask what they think THE MOMENT is`, optimal:true, next:`"I think it\'s in the clock tower. Something happens at exactly ${p.time}."`},
          {text:'Ask why you\'re both looping', optimal:false, next:'"I don\'t know. I just know we have to fix something."'},
          {text:'Work together to map the entire day', optimal:true, next:'You split up and compare notes. A pattern emerges around the clock tower.'},
          {text:'Distrust them — they could be the cause', optimal:false, next:'Suspicion wastes this loop. Cooperation is the better bet.'}
        ]
      },
      {
        text: `The clock tower. At exactly ${p.time}, a gear mechanism jams. This triggers a cascade: the power outage, the accident (from broken traffic lights), everything. ${p.item}'s inscription matches a slot in the mechanism.`,
        choices: [
          {text:`Insert ${p.item} into the mechanism at the right moment`, optimal:true, next:`${p.item} fits perfectly. The gears catch and turn smoothly.`},
          {text:'Try to fix the gear manually', optimal:false, next:'It\'s too corroded. Manual repair isn\'t possible in time.'},
          {text:`Let the stranger do it — they have more experience`, optimal:false, next:`They don\'t have ${p.item}. It has to be you.`},
          {text:'Wait and observe first to understand the mechanism', optimal:true, next:'Understanding the timing is crucial. You count: 3... 2... 1...'}
        ]
      },
      {
        text: `${p.item} clicks into place. The clock chimes. The cascade events reverse: lights work, accident avoided, power stays on. ${p.time} comes... and passes. Time moves forward.`,
        choices: [
          {text:'Thank the stranger and step into a new tomorrow', optimal:true, next:'They smile. "See you in a world that keeps moving." Dawn breaks differently.'},
          {text:'Document everything before you forget', optimal:true, next:'You write it all down. A story nobody will believe — but it\'s true.'},
          {text:'Try to loop one more time to fix other things', optimal:false, next:'Greed. The loop is broken. Accept the gift of moving forward.'},
          {text:'Check if everything is really different', optimal:false, next:'Tomorrow comes. Then the next day. It\'s real. The loop is broken.'}
        ]
      }
    ]
  },
  {
    id:'pirate1', name:'Pirate Treasure Hunt',
    params: () => ({ship: rngPick(['The Black Marlin','Queen Anne\'s Revenge','The Crimson Tide']), island: rngPick(['Skull Island','Devil\'s Cove','Serpent Bay']), treasure: rngPick(['Captain Flint\'s gold','the Aztec emeralds','the Sultan\'s rubies'])}),
    screens: (p) => [
      {
        text: `${p.ship} anchors near ${p.island}. Your map shows ${p.treasure} is somewhere inland. The crew is restless. You see a beach landing and a rocky cove.`,
        choices: [
          {text:'Land at the cove — more hidden from rival ships', optimal:true, next:'The cove provides cover. You secure the longboat and head inland.'},
          {text:'Take the easy beach route', optimal:false, next:'Open beach. If anyone\'s watching, they see you clearly.'},
          {text:'Send scouts ahead first', optimal:true, next:'Scouts return: a path through jungle and fresh water inland. Good intel.'},
          {text:'Fire cannons to scare off any competition', optimal:false, next:'Noise alerts everyone on the island to your presence.'}
        ]
      },
      {
        text: `Inland, the map shows a fork: left toward a waterfall, right toward ancient ruins. An X is marked between them. The jungle is dense.`,
        choices: [
          {text:'Head toward the ruins — treasure is often buried near landmarks', optimal:true, next:'Crumbling stone walls. The map\'s X aligns with a carved marker.'},
          {text:'Follow the waterfall — water sources are meeting points', optimal:false, next:'Beautiful waterfall but no treasure markers.'},
          {text:'Use the map\'s compass rose to triangulate the X', optimal:true, next:'Precise navigation puts you at a clearing between the two landmarks.'},
          {text:'Split the crew to cover both directions', optimal:false, next:'Half your crew wanders off. Reuniting wastes hours.'}
        ]
      },
      {
        text: `At the X: a stone slab with engravings. Three symbols match shapes on your treasure map. There\'s a mechanism — press them in the right order.`,
        choices: [
          {text:'Match the symbols to the map\'s legend order', optimal:true, next:'Click, click, click. The slab shifts, revealing stairs downward.'},
          {text:'Try random combinations', optimal:false, next:'Wrong order triggers a dart trap. One crew member is nicked.'},
          {text:'Study the engravings for a pattern', optimal:true, next:'The sun rises east to west — the symbols follow the same progression.'},
          {text:'Pry the slab open by force', optimal:false, next:'The stone is too heavy. You\'d need equipment you don\'t have.'}
        ]
      },
      {
        text: `Underground passage. Torchlight reveals three chambers: one flooded, one with a rickety bridge over a pit, and one with a strange echo.`,
        choices: [
          {text:'Take the chamber with the echo — sound suggests open space', optimal:true, next:'The echo chamber opens into a vast cavern. Gold glints in the torchlight!'},
          {text:'Cross the rickety bridge', optimal:false, next:'Halfway across, planks crack. You barely make it. Dead end.'},
          {text:'Wade through the flooded chamber', optimal:false, next:'Waist-deep and cold. Something brushes your leg. No treasure here.'},
          {text:'Test each path with a tossed pebble first', optimal:true, next:'The echo chamber\'s pebble clatters for seconds. Big space ahead.'}
        ]
      },
      {
        text: `${p.treasure} lies in a chest on a pedestal. But the cavern has two exits: the way you came, and a passage that might lead to the beach.`,
        choices: [
          {text:`Take the treasure and use the new passage`, optimal:true, next:`It opens right at the cove. ${p.ship} is waiting. Triumphant return!`},
          {text:'Go back the way you came — known safe route', optimal:true, next:'Retracing your steps takes longer but you return safely with the loot.'},
          {text:'Take only what you can carry and explore further', optimal:false, next:'Greed. More caves, more danger. Take the treasure and leave.'},
          {text:'Booby-trap the entrance so no one else can find it', optimal:false, next:'You already have the treasure. No need to trap the empty cave.'}
        ]
      }
    ]
  },
  {
    id:'hospital1', name:'The Haunted Hospital',
    params: () => ({wing: rngPick(['East Wing','West Wing','Pediatrics']), ghost: rngPick(['Nurse Hollow','Dr. Graves','Patient Zero']), room: rngInt(100,399)}),
    screens: (p) => [
      {
        text: `You\'re locked inside an abandoned hospital. The ${p.wing} corridor stretches ahead, flickering lights casting long shadows. A clipboard on the floor mentions ${p.ghost}. Two paths: the main hallway or a side stairwell.`,
        choices: [
          {text:'Take the side stairwell — less exposed', optimal:true, next:'The stairwell is dark but quiet. You descend one floor safely.'},
          {text:'Walk the main hallway', optimal:false, next:'A gurney rolls toward you on its own. You stumble back, losing time.'},
          {text:'Check the clipboard for a map', optimal:true, next:'The clipboard has a floor plan. Room ${p.room} is marked "EXIT ROUTE."'},
          {text:'Call out to see if anyone is here', optimal:false, next:'Your voice echoes. Something answers from the dark. Not helpful.'}
        ]
      },
      {
        text: `You reach a nurses\' station. Medicine cabinets line the walls. A phone rings at the desk — the caller ID shows Room ${p.room}. A door leads to the pharmacy, another to the morgue.`,
        choices: [
          {text:'Answer the phone', optimal:true, next:'Static, then a whisper: "The morgue key is in drawer 3." Useful intel.'},
          {text:'Search the pharmacy for supplies', optimal:true, next:'You find a flashlight and a set of master keys. Excellent.'},
          {text:'Head straight to the morgue', optimal:false, next:'The morgue door is locked. You waste time jiggling the handle.'},
          {text:'Hide behind the desk and wait', optimal:false, next:'Minutes pass. Hiding accomplishes nothing.'}
        ]
      },
      {
        text: `A cold draft blows from the morgue corridor. You hear ${p.ghost}\'s name whispered through the vents. There\'s a locked elevator and a laundry chute.`,
        choices: [
          {text:'Slide down the laundry chute', optimal:true, next:'A wild ride deposits you in the basement. Closer to the exit.'},
          {text:'Try the elevator — maybe the keys work', optimal:false, next:'The elevator is dead. No power to this section.'},
          {text:'Follow the cold draft to find the source', optimal:true, next:'The draft leads to a broken window. Moonlight reveals a fire escape outside.'},
          {text:'Go back to find another route', optimal:false, next:'Backtracking through the dark halls wastes precious time.'}
        ]
      },
      {
        text: `The basement is a maze of storage rooms. Emergency exit signs point left, but you hear banging from the right. A patient board shows Room ${p.room} is directly above you.`,
        choices: [
          {text:'Follow the emergency exit signs', optimal:true, next:'The signs lead to a loading dock. Fresh air ahead.'},
          {text:'Investigate the banging noise', optimal:false, next:'A loose pipe. Just wind. You wasted time on nothing.'},
          {text:'Look for a basement floor plan', optimal:true, next:'A plan on the wall shows the loading dock is 30 meters left. Almost there.'},
          {text:'Try to go back upstairs', optimal:false, next:'The stairwell door locked behind you. No going back.'}
        ]
      },
      {
        text: `The loading dock is ahead. A shutter door is chained, but there\'s a control panel and a side door marked "AUTHORIZED ONLY." ${p.ghost}\'s shadow flickers behind you.`,
        choices: [
          {text:'Use the control panel to raise the shutter', optimal:true, next:'The shutter groans open. Dawn light floods in. You sprint to freedom!'},
          {text:'Try the side door with your keys', optimal:true, next:'The master key fits. The door opens to the parking lot. Escape!'},
          {text:'Try to break the chain', optimal:false, next:'The chain is industrial grade. Your hands ache. Not happening.'},
          {text:'Turn and confront the shadow', optimal:false, next:'There\'s nothing to confront — and now you\'ve lost your nerve.'}
        ]
      }
    ]
  },
  {
    id:'temple1', name:'The Underwater Temple',
    params: () => ({deity: rngPick(['Poseidon','Thalassa','Leviathan']), gem: rngPick(['sapphire','pearl','aquamarine']), depth: rngInt(50,200)}),
    screens: (p) => [
      {
        text: `Your submarine has docked at an underwater temple ${p.depth} meters below the surface. The airlock opens to a flooded antechamber dedicated to ${p.deity}. A ${p.gem} glows on the altar. Two tunnels branch off: one carved with fish, the other with tentacles.`,
        choices: [
          {text:'Take the fish-carved tunnel — fish seek open water', optimal:true, next:'The tunnel slopes upward. Air pockets form along the ceiling.'},
          {text:'Take the tentacle tunnel', optimal:false, next:'Narrow and winding. Something slimy brushes your leg.'},
          {text:`Examine the ${p.gem} on the altar`, optimal:true, next:`The ${p.gem} detaches — it fits a socket you noticed on the far wall.`},
          {text:'Return to the submarine', optimal:false, next:'The airlock has sealed. The sub\'s systems are cycling. No going back.'}
        ]
      },
      {
        text: `A grand hall stretches before you, columns wrapped in bioluminescent coral. The ceiling is cracked — seawater drips through. Three statues of ${p.deity} each hold a trident pointing in different directions.`,
        choices: [
          {text:'Follow the trident pointing upward', optimal:true, next:'An ascending corridor. The water level drops with each step.'},
          {text:'Follow the trident pointing left', optimal:false, next:'A dead-end chamber with beautiful murals but no exit.'},
          {text:'Search the base of the statues for clues', optimal:true, next:'Inscriptions reveal: "The surface-seeker ascends." The upward trident is correct.'},
          {text:'Try to break through the cracked ceiling', optimal:false, next:'More water pours in. Bad idea. Very bad idea.'}
        ]
      },
      {
        text: `An air pocket chamber. Ancient machinery hums — a pump system still works after millennia. A ${p.gem}-shaped socket is embedded in the control panel. Water is rising from below.`,
        choices: [
          {text:`Insert the ${p.gem} into the socket`, optimal:true, next:'The machinery roars. Pumps activate, draining water from the upper chambers.'},
          {text:'Try to operate the panel without the gem', optimal:false, next:'Buttons click but nothing happens. Something is missing.'},
          {text:'Search for another air pocket higher up', optimal:true, next:'You find a dry alcove with breathable air and a ladder going up.'},
          {text:'Dive back down to find another route', optimal:false, next:'The lower chambers are fully flooded now. Can\'t go deeper.'}
        ]
      },
      {
        text: `The drained upper chamber reveals a massive door with ${p.deity}\'s face carved into it. The eyes are hollow — two gem sockets. You have one ${p.gem}. A mosaic on the floor shows a constellation pattern.`,
        choices: [
          {text:'Place your gem in one eye and look for another', optimal:true, next:'Behind a loose tile matching the constellation, you find a second gem. Both eyes glow.'},
          {text:'Follow the constellation mosaic pattern', optimal:true, next:'The pattern leads to a hidden compartment with the second gem.'},
          {text:'Try to force the door open', optimal:false, next:'Stone grinds but doesn\'t budge. It needs both gems.'},
          {text:'Go back and search the lower chambers', optimal:false, next:'They\'re reflooding. The second gem must be up here.'}
        ]
      },
      {
        text: `The great door opens to a vertical shaft. Sunlight filters down from ${p.depth} meters above. An ancient elevator platform sits on rusted chains. Coral-covered rungs line the wall as an alternative.`,
        choices: [
          {text:'Climb the rungs — more reliable than old chains', optimal:true, next:'Steady climbing. The light grows brighter. You emerge on a rocky island, gasping fresh air!'},
          {text:'Test the elevator mechanism first, then ride it', optimal:true, next:'The chains hold. The platform rises slowly to the surface. Sunlight at last!'},
          {text:'Jump into the shaft and try to swim up', optimal:false, next:`${p.depth} meters is too far to free-swim. You\'d never make it.`},
          {text:'Wait for rescue in the chamber', optimal:false, next:'No one knows you\'re here. Waiting is not a plan.'}
        ]
      }
    ]
  },
  {
    id:'alien1', name:'The Alien Spaceship',
    params: () => ({species: rngPick(['Zorath','Krell','Vantari']), fuel: rngPick(['plasma core','quantum cell','dark matter']), sector: rngInt(1,9)}),
    screens: (p) => [
      {
        text: `You awaken on a ${p.species} vessel. An alarm blares in an alien language. Through the viewport, you see Sector ${p.sector} — deep space. The ${p.fuel} is failing. A console flickers nearby, and a corridor leads aft.`,
        choices: [
          {text:'Access the console — learn the ship', optimal:true, next:'Alien interface, but icons are intuitive. You find a ship map. Engine room is aft.'},
          {text:'Head aft toward the engine room', optimal:false, next:'You wander through identical corridors. Without a map, you get turned around.'},
          {text:'Search your surroundings for a translation device', optimal:true, next:'A wristband on the floor auto-translates the alarm: "Fuel critical. 10 minutes."'},
          {text:'Try to send a distress signal', optimal:false, next:'The comm system requires biometric access. ${p.species} biology only.'}
        ]
      },
      {
        text: `The ship map shows three key areas: Engineering (${p.fuel} storage), the Bridge, and an Escape Pod bay. Red zones indicate hull breaches in two sections. Time is short.`,
        choices: [
          {text:'Head to the Escape Pod bay — get off this ship', optimal:true, next:'The pod bay has one functional pod. It needs a launch key.'},
          {text:'Go to Engineering to stabilize the fuel', optimal:true, next:'The ${p.fuel} is cracked but holding. You reroute backup power. Buys a few minutes.'},
          {text:'Go to the Bridge to take control', optimal:false, next:'Bridge controls require ${p.species} biometrics. You can\'t pilot this ship.'},
          {text:'Explore the hull breach areas', optimal:false, next:'Vacuum beyond those doors. Opening them would be fatal.'}
        ]
      },
      {
        text: `The escape pod needs a launch key. A terminal shows the key was last logged in the Captain\'s quarters. You also notice a maintenance hatch and a cargo elevator.`,
        choices: [
          {text:'Find the Captain\'s quarters on the map', optimal:true, next:'Deck 2, port side. You navigate there quickly — a silver key sits on the desk.'},
          {text:'Try to hotwire the pod without a key', optimal:false, next:'Alien wiring. One wrong connection and the pod\'s thrusters fire while docked.'},
          {text:'Check the maintenance hatch for a shortcut', optimal:true, next:'The hatch connects to a crawlspace that passes right by the Captain\'s quarters.'},
          {text:'Take the cargo elevator to search other decks', optimal:false, next:'The elevator stalls between floors. You pry the doors and climb out, wasting time.'}
        ]
      },
      {
        text: `You have the launch key. Back at the pod bay, the ship shudders — the ${p.fuel} is in final collapse. The pod\'s navigation shows three jump destinations in Sector ${p.sector}.`,
        choices: [
          {text:'Select the nearest inhabited system', optimal:true, next:'A space station 4 light-minutes away. Best chance of rescue.'},
          {text:'Plot a course for Earth', optimal:false, next:'Earth is thousands of light-years away. The pod doesn\'t have that range.'},
          {text:'Let the pod\'s auto-navigation choose', optimal:true, next:'The ${p.species} autopilot selects optimal trajectory. It knows this sector.'},
          {text:'Just launch without setting coordinates', optimal:false, next:'Drifting in deep space with no heading is worse than the ship.'}
        ]
      },
      {
        text: `The pod launches as the ${p.species} vessel breaks apart behind you. But the pod\'s oxygen is limited. You see two options: a nearby asteroid with a signal beacon, or push straight for the station.`,
        choices: [
          {text:'Push for the station — you have enough oxygen', optimal:true, next:'Tight but manageable. The station\'s tractor beam locks on. You\'re safe!'},
          {text:'Stop at the asteroid to extend oxygen supply', optimal:true, next:'The beacon has an emergency air cache. Topped off, you cruise to the station easily.'},
          {text:'Turn back to salvage more from the wreckage', optimal:false, next:'The wreckage is a debris field. Nothing salvageable. Oxygen wasted.'},
          {text:'Put yourself in cryo-sleep and hope for rescue', optimal:false, next:'The pod has no cryo system. That\'s a movie thing.'}
        ]
      }
    ]
  },
  {
    id:'dungeon1', name:'The Medieval Dungeon',
    params: () => ({captor: rngPick(['Baron Darkmore','the Iron Duke','Lady Ravencroft']), weapon: rngPick(['a rusty dagger','a broken sword','a torch']), cell: rngInt(1,20)}),
    screens: (p) => [
      {
        text: `You\'re chained in Cell ${p.cell} of ${p.captor}\'s dungeon. Rats scurry across the stone floor. You spot ${p.weapon} under the straw, and the guard is dozing by the door.`,
        choices: [
          {text:`Quietly grab ${p.weapon} and pick the lock`, optimal:true, next:'The chains click open. You slip free without waking the guard.'},
          {text:'Shout to distract the guard, then act', optimal:false, next:'The guard startles awake and sounds an alarm. Bad start.'},
          {text:'Study the cell for weaknesses in the stonework', optimal:true, next:'A loose stone reveals a tunnel. Previous prisoners dug an escape route.'},
          {text:'Try to break the chains with brute force', optimal:false, next:'Iron chains don\'t yield to bare hands. You just bruise your wrists.'}
        ]
      },
      {
        text: `Free from your cell, the dungeon stretches in two directions. Left: more cells and the sound of dripping water. Right: a guard room with firelight and voices. A stairway spirals upward at the far end.`,
        choices: [
          {text:'Creep right past the guard room toward the stairs', optimal:true, next:'Pressed against the wall, you slip past. The guards argue over dice, oblivious.'},
          {text:'Go left — fewer guards near the cells', optimal:true, next:'The cellblock has a drainage grate. It leads to the castle sewers.'},
          {text:'Rush the guard room and fight', optimal:false, next:'Two armed guards vs. you with ${p.weapon}. You barely escape with a wound.'},
          {text:'Go back and hide in your cell', optimal:false, next:'Retreating to a cell? That defeats the entire purpose.'}
        ]
      },
      {
        text: `You reach the lower castle. A kitchen bustles with servants, and a courtyard is visible through an archway. ${p.captor}\'s banner hangs everywhere. A servant\'s cloak hangs on a hook.`,
        choices: [
          {text:'Steal the cloak and disguise yourself', optimal:true, next:'Hooded and cloaked, you blend in with the servants perfectly.'},
          {text:'Sneak through the courtyard in the shadows', optimal:false, next:'A patrolling guard spots movement. "Who goes there!" You barely duck away.'},
          {text:'Slip through the kitchen while servants are busy', optimal:true, next:'Everyone\'s focused on the feast preparations. You pass through unseen.'},
          {text:'Climb out a window', optimal:false, next:'The window overlooks a 30-foot drop to the moat. Too risky.'}
        ]
      },
      {
        text: `The outer bailey. The main gate is guarded by four soldiers. A stable sits to the left, a chapel to the right. The castle wall has a section under repair with scaffolding.`,
        choices: [
          {text:'Climb the scaffolding to the wall top', optimal:true, next:'The scaffolding holds. From the wall, you see the forest beyond the moat.'},
          {text:'Steal a horse from the stable', optimal:false, next:'Horses whinny loudly. A stable hand shouts for the guards.'},
          {text:'Hide in the chapel until nightfall', optimal:true, next:'The chapel is empty. At nightfall, the guard rotation thins. Smart timing.'},
          {text:'Try to walk out the main gate in disguise', optimal:false, next:'The gate guards check everyone. Your disguise won\'t survive close inspection.'}
        ]
      },
      {
        text: `You\'re at the castle wall. The moat below is dark but crossable. A rope hangs from the scaffolding. Beyond the moat, the tree line offers cover. ${p.captor}\'s hunting horn sounds — they know you\'re gone.`,
        choices: [
          {text:'Rappel down the rope and swim the moat', optimal:true, next:'Cold water, but you cross quickly. Into the trees and gone. Freedom at last!'},
          {text:'Use the rope to swing across the moat to the bank', optimal:true, next:'A daring swing carries you over the water. You land running into the forest.'},
          {text:'Jump directly into the moat', optimal:false, next:'The drop is farther than it looked. You hit the water hard and surface gasping.'},
          {text:'Stay on the wall and look for a bridge', optimal:false, next:'There\'s no hidden bridge. And the alarm means time is up.'}
        ]
      }
    ]
  },
  {
    id:'noir1', name:'The Noir Case',
    params: () => ({victim: rngPick(['Vivian Marlowe','Johnny Santini','Eloise Crane']), bar: rngPick(['The Blue Parrot','Smoky Joe\'s','The Velvet Room']), suspect: rngPick(['the butler','the business partner','the ex-lover'])}),
    screens: (p) => [
      {
        text: `Rain hammers the city. ${p.victim} was found dead in the alley behind ${p.bar}. You\'re the detective. The body is cold, the scene contaminated. Your leads: ${p.suspect} and a matchbook from the bar.`,
        choices: [
          {text:'Examine the matchbook for clues', optimal:true, next:'A phone number is scrawled inside. Could be the killer\'s contact.'},
          {text:`Head into ${p.bar} to ask questions`, optimal:true, next:'The bartender remembers ${p.victim} arguing with someone that night.'},
          {text:'Canvas the neighborhood at 2 AM', optimal:false, next:'Nobody talks at this hour. Doors stay shut. Wasted shoe leather.'},
          {text:'Call it in and wait for forensics', optimal:false, next:'Forensics won\'t arrive until morning. The trail goes cold.'}
        ]
      },
      {
        text: `The bartender says ${p.victim} left ${p.bar} with a tall figure in a dark coat. The phone number traces to a warehouse on the docks. Meanwhile, ${p.suspect} has no alibi.`,
        choices: [
          {text:'Visit the warehouse — follow the physical evidence', optimal:true, next:'The warehouse is empty but recently used. Cigarette butts and rope on the floor.'},
          {text:`Bring ${p.suspect} in for questioning`, optimal:true, next:'Under pressure, ${p.suspect} admits to an argument but denies the murder. Nervous though.'},
          {text:'Stake out the bar for the tall figure', optimal:false, next:'Hours pass. The figure doesn\'t return. Dead end for tonight.'},
          {text:'Check ${p.victim}\'s home', optimal:false, next:'Locked up tight. Getting a warrant will take days.'}
        ]
      },
      {
        text: `The warehouse rope matches marks on ${p.victim}. ${p.suspect}\'s story has a hole — they claim to have been home, but a neighbor saw them leave at 11 PM. A security camera outside ${p.bar} might have footage.`,
        choices: [
          {text:'Get the security footage', optimal:true, next:'Grainy but clear: ${p.victim} and a tall figure leaving at 11:47 PM.'},
          {text:'Confront ${p.suspect} with the neighbor\'s testimony', optimal:true, next:'${p.suspect} cracks slightly: "Fine, I went out. But not to kill anyone."'},
          {text:'Search the warehouse more thoroughly at night', optimal:false, next:'In the dark, you miss details. Should have come with better light.'},
          {text:'Ask the local snitches', optimal:false, next:'Street informants know nothing about this. Too upscale a crime.'}
        ]
      },
      {
        text: `The footage shows the tall figure\'s face — it\'s ${p.suspect}\'s associate. But ${p.suspect} had the motive. You need to connect them. A receipt in the warehouse links to a downtown hotel.`,
        choices: [
          {text:'Check the hotel registration records', optimal:true, next:'The associate checked in under a fake name — but paid with a traceable credit card.'},
          {text:'Set up a meeting between the suspects', optimal:false, next:'Tipping them off lets them coordinate their stories. Rookie mistake.'},
          {text:'Get a warrant for ${p.suspect}\'s financial records', optimal:true, next:'Wire transfers to the associate. Payment for a hit. There\'s your case.'},
          {text:'Tail the associate and hope they slip up', optimal:false, next:'They spot your tail and disappear. Evidence over surveillance next time.'}
        ]
      },
      {
        text: `You have the financial link and the footage. Time to close the case. ${p.suspect} is at ${p.bar} right now. The associate is at the hotel.`,
        choices: [
          {text:'Arrest both simultaneously with backup', optimal:true, next:'Coordinated arrest. Neither can warn the other. Both in custody. Case closed.'},
          {text:'Arrest ${p.suspect} first — they\'re the mastermind', optimal:true, next:'${p.suspect} is cuffed at the bar. Officers grab the associate minutes later. Justice for ${p.victim}.'},
          {text:'Confront ${p.suspect} alone at the bar', optimal:false, next:'Going alone? ${p.suspect} has dangerous friends. Bad call, detective.'},
          {text:'Present the evidence to the DA first', optimal:false, next:'Bureaucracy takes days. Meanwhile, suspects could flee.'}
        ]
      }
    ]
  },
  {
    id:'saloon1', name:'Wild West Showdown',
    params: () => ({town: rngPick(['Deadwood','Tombstone','Silver Creek']), outlaw: rngPick(['Black Bart','the Dalton Gang','Rattlesnake Pete']), horse: rngPick(['a painted mustang','a black stallion','a chestnut mare'])}),
    screens: (p) => [
      {
        text: `${p.town} is under siege. ${p.outlaw} has taken the mayor hostage in the saloon. You\'re the sheriff, standing at the edge of Main Street with ${p.horse} behind you. Townsfolk peer from windows.`,
        choices: [
          {text:'Circle around to the saloon\'s back entrance', optimal:true, next:'The alley is clear. You reach the back door undetected.'},
          {text:'Walk straight down Main Street to negotiate', optimal:false, next:'A warning shot kicks dust at your boots. "One more step, Sheriff!"'},
          {text:'Rally the deputies and form a plan', optimal:true, next:'Three deputies join you. One covers the roof, two flank the sides. Good strategy.'},
          {text:'Ride ${p.horse} straight at the saloon doors', optimal:false, next:'Dramatic but foolish. ${p.outlaw}\'s lookout spots you coming a mile away.'}
        ]
      },
      {
        text: `From cover, you see ${p.outlaw} through the saloon window. The mayor is tied to a chair. Three gang members guard the entrance, and one watches the back. A water tower overlooks the scene.`,
        choices: [
          {text:'Position a deputy on the water tower as a sharpshooter', optimal:true, next:'High ground secured. Your deputy has a clear line of sight inside.'},
          {text:'Create a distraction — spook the horses at the hitching post', optimal:true, next:'Horses scatter and whinny. The back lookout steps outside to check. Opening created.'},
          {text:'Toss dynamite through the window', optimal:false, next:'The mayor is IN there. Collateral damage is not the plan.'},
          {text:'Wait them out — they\'ll surrender eventually', optimal:false, next:'${p.outlaw} threatens to harm the mayor if demands aren\'t met in 10 minutes.'}
        ]
      },
      {
        text: `The back lookout is distracted. You slip inside through the storeroom. Whiskey barrels and crates provide cover. Voices from the main room — ${p.outlaw} is growing impatient.`,
        choices: [
          {text:'Peek through the storeroom door to assess positions', optimal:true, next:'Two at the front, one at the bar, ${p.outlaw} by the mayor. You can plan your moves.'},
          {text:'Kick down the door guns blazing', optimal:false, next:'Surprise lasts a second. Now you\'re in a crossfire with the mayor in between.'},
          {text:'Roll a whiskey barrel into the room as cover', optimal:true, next:'The barrel crashes through the door. Gang members dive aside. Chaos is your friend.'},
          {text:'Set fire to the storeroom as a distraction', optimal:false, next:'A burning saloon with a hostage inside. Think, Sheriff.'}
        ]
      },
      {
        text: `In the confusion, you\'ve neutralized two gang members. ${p.outlaw} holds a pistol to the mayor\'s head. "Drop your iron, Sheriff, or the mayor gets it." Your deputy has a shot from the water tower.`,
        choices: [
          {text:'Signal the deputy to take the shot', optimal:true, next:'A crack from the tower. ${p.outlaw}\'s hat flies off, pistol clatters to the floor. Perfect shot.'},
          {text:'Keep ${p.outlaw} talking while edging closer', optimal:true, next:'You hold their attention. Three steps closer... two... you lunge and disarm them.'},
          {text:'Drop your gun and try to negotiate', optimal:false, next:'Unarmed sheriff is a dead sheriff. ${p.outlaw} has no reason to negotiate.'},
          {text:'Shoot the chandelier to create darkness', optimal:false, next:'It\'s daytime. Shooting a chandelier doesn\'t darken a room with windows.'}
        ]
      },
      {
        text: `${p.outlaw} is disarmed. But the last gang member makes a break for it, jumping on ${p.horse} outside. The mayor is safe but the outlaw is escaping down Main Street.`,
        choices: [
          {text:'Grab a horse from the hitching post and give chase', optimal:true, next:'You ride hard and cut them off at the canyon. Lasso brings them down. Justice served!'},
          {text:'Let the deputy on the tower handle it', optimal:true, next:'A warning shot stops the horse cold. The gang member surrenders. ${p.town} is saved.'},
          {text:'Let them go — you got the leader', optimal:false, next:'A loose gang member will just recruit more trouble. Finish the job.'},
          {text:'Shoot at the fleeing rider from the saloon', optimal:false, next:'Too far, too many civilians on the street. Reckless.'}
        ]
      }
    ]
  },
  {
    id:'airplane1', name:'Airplane Emergency',
    params: () => ({flight: rngPick(['Flight 714','Flight 209','Flight 881']), airline: rngPick(['Pacific Air','TransAtlantic','SkyBridge']), altitude: rngInt(25000,38000)}),
    screens: (p) => [
      {
        text: `${p.airline} ${p.flight} at ${p.altitude} feet. Both pilots are incapacitated from food poisoning. You\'re a passenger with some flight training. The cabin crew asks for help. Oxygen masks have deployed.`,
        choices: [
          {text:'Enter the cockpit and assess instruments', optimal:true, next:'Autopilot is engaged. The plane is stable for now. You study the controls.'},
          {text:'Radio for help immediately', optimal:true, next:'Mayday on 121.5. Air traffic control responds. They\'ll talk you through this.'},
          {text:'Ask if any other passengers are pilots', optimal:false, next:'No one else. You\'re it. Should have gone to the cockpit first.'},
          {text:'Try to wake the pilots', optimal:false, next:'They\'re out cold. Medical help can\'t arrive at ${p.altitude} feet.'}
        ]
      },
      {
        text: `ATC has you on radar. They\'re vectoring you toward the nearest airport. The fuel gauge shows 2 hours. But a warning light flashes — hydraulic pressure dropping in system 1. Backup system 2 is operational.`,
        choices: [
          {text:'Switch to hydraulic system 2 as ATC instructs', optimal:true, next:'System 2 engaged. Controls feel different but responsive. You\'re still flying.'},
          {text:'Ask ATC to prioritize landing — don\'t wait', optimal:true, next:'ATC clears all traffic. Straight-in approach to the nearest runway. 40 minutes out.'},
          {text:'Descend immediately to reduce stress on the plane', optimal:false, next:'Rapid descent without ATC guidance could put you in other traffic. Follow the pros.'},
          {text:'Try to fix hydraulic system 1', optimal:false, next:'You\'re not a mechanic and you\'re flying the plane. Focus on what matters.'}
        ]
      },
      {
        text: `The airport is 30 minutes out. ATC walks you through the approach checklist. Flaps, gear, speed. A flight attendant reports turbulence is making passengers panic. Weather ahead looks rough.`,
        choices: [
          {text:'Stay focused on ATC instructions — crew handles passengers', optimal:true, next:'The flight attendant calms the cabin. You concentrate on the checklist. Disciplined.'},
          {text:'Request a different runway to avoid the weather', optimal:true, next:'ATC vectors you to runway 27L — clear skies on approach. Smart thinking.'},
          {text:'Make a PA announcement yourself', optimal:false, next:'Talking on PA means hands off controls and eyes off instruments. Let the crew do it.'},
          {text:'Speed up to get there faster before weather hits', optimal:false, next:'Faster approach speed makes landing much harder. Stick to the numbers.'}
        ]
      },
      {
        text: `Visual on the runway. ATC says you\'re high and fast. The landing gear indicator shows three green — gear is down. Crosswind from the left. This is it.`,
        choices: [
          {text:'Follow ATC: reduce power, maintain glide slope', optimal:true, next:'Speed bleeds off. The runway grows. You\'re right on target.'},
          {text:'Crab into the crosswind as trained', optimal:true, next:'Nose angled left, tracking straight. Textbook crosswind technique.'},
          {text:'Go around and try again', optimal:false, next:'With hydraulic issues, every extra minute in the air is risk. Commit to this approach.'},
          {text:'Point straight at the runway and power through', optimal:false, next:'Ignoring crosswind means drifting off the runway. Physics doesn\'t care about bravery.'}
        ]
      },
      {
        text: `Over the threshold. Runway lights blur past. ATC says "You\'re looking good, ${p.flight}." Altitude 50 feet... 30... 20... flare now.`,
        choices: [
          {text:'Gently pull back, reduce power, let it settle', optimal:true, next:'Tires screech. A firm landing but you\'re on the ground. Emergency crews swarm. You did it!'},
          {text:'Trust ATC\'s callouts and follow their timing', optimal:true, next:'"Flare... flare... hold it..." Touchdown. The cabin erupts in cheers. Hero of ${p.flight}.'},
          {text:'Slam it down hard to make sure you don\'t float', optimal:false, next:'Hard landing blows a tire, but you\'re on the ground. Scary but survivable.'},
          {text:'Close your eyes and hope for the best', optimal:false, next:'Flying requires eyes open. Every second counts at this altitude.'}
        ]
      }
    ]
  },
  {
    id:'bunker1', name:'The Nuclear Bunker',
    params: () => ({facility: rngPick(['Site Alpha','Raven Rock','Bunker 7']), code: rngInt(1000,9999), year: rngPick(['1962','1983','2003'])}),
    screens: (p) => [
      {
        text: `${p.facility}, sealed since ${p.year}. You\'re part of an exploration team, but a cave-in has trapped you inside. Emergency lighting casts everything in amber. The blast door behind you is jammed. Two corridors ahead: Command Center and Residential Wing.`,
        choices: [
          {text:'Head to Command Center — comms equipment there', optimal:true, next:'Banks of vintage computers and a radio. If anything works, this is your lifeline.'},
          {text:'Check Residential Wing for supplies first', optimal:true, next:'Canned food, water purification tablets, and flashlights. You can survive while planning.'},
          {text:'Try to force the blast door open', optimal:false, next:'It weighs several tons and the hydraulics are dead. Not happening.'},
          {text:'Yell through the cave-in to your surface team', optimal:false, next:'Meters of rubble muffle everything. They can\'t hear you.'}
        ]
      },
      {
        text: `The Command Center radio is vintage but intact. A logbook shows the last entry: "Code ${p.code} required for emergency ventilation." The radio needs power. A generator room is marked on the wall map.`,
        choices: [
          {text:'Find the generator room and restore power', optimal:true, next:'Diesel generator. It sputters, coughs, then rumbles to life. Lights flicker on across the bunker.'},
          {text:'Note code ${p.code} and explore further', optimal:true, next:'You memorize the code. It might open other systems too.'},
          {text:'Try to hand-crank the radio', optimal:false, next:'This isn\'t a hand-crank model. It needs real power.'},
          {text:'Search the command center for batteries', optimal:false, next:'${p.year}-era batteries are long dead. Need the generator.'}
        ]
      },
      {
        text: `Power restored. The radio crackles with static. A ventilation panel requires code ${p.code} — fresh air would help. The bunker map also shows an emergency tunnel exit, but it\'s behind a sealed door on Level 3.`,
        choices: [
          {text:'Enter code ${p.code} on the ventilation panel', optimal:true, next:'Fans whir. Fresh air flows through ancient ducts. Breathing gets easier.'},
          {text:'Try the radio to contact your surface team', optimal:true, next:'Through static: "We read you! Digging from our side. Estimate 6 hours."'},
          {text:'Rush to Level 3 to find the emergency exit', optimal:false, next:'Level 3 is pitch black and flooded in sections. Too dangerous without recon.'},
          {text:'Shut down non-essential systems to conserve fuel', optimal:false, next:'The generator has plenty of diesel. Keep everything running — you need it all.'}
        ]
      },
      {
        text: `Radio contact established. But 6 hours is a long time with limited air flow. The Level 3 emergency tunnel could be faster. A map shows it exits 200 meters from the main entrance. The sealed door needs... code ${p.code}.`,
        choices: [
          {text:'Enter code ${p.code} on the Level 3 door', optimal:true, next:'The door grinds open. A tunnel stretches into darkness, but air flows from the far end — it\'s open!'},
          {text:'Wait for rescue — it\'s safer', optimal:true, next:'6 hours with ventilation is manageable. Your team breaks through on schedule.'},
          {text:'Try to dig through the cave-in yourself', optimal:false, next:'Moving rubble risks further collapse. Let the professionals handle it.'},
          {text:'Explore random corridors looking for exits', optimal:false, next:'${p.facility} is a maze. Without the map, you\'ll get lost in Cold War-era tunnels.'}
        ]
      },
      {
        text: `The emergency tunnel is passable. Old rail tracks line the floor. Daylight glimmers at the far end. Behind you, the bunker groans — the structure is settling after the cave-in.`,
        choices: [
          {text:'Move quickly but carefully along the tracks', optimal:true, next:'Steady pace on the rails. The light grows. You emerge blinking into daylight. Rescue team cheers!'},
          {text:'Check the tunnel supports as you go', optimal:true, next:'Supports are old but solid. You verify as you walk. Safe passage to the exit.'},
          {text:'Run full speed toward the light', optimal:false, next:'You trip on a rail tie in the dark. Twisted ankle. You limp out, but it hurts.'},
          {text:'Go back for more supplies before leaving', optimal:false, next:'The bunker is groaning. Get out while the tunnel holds. Now.'}
        ]
      }
    ]
  },
  {
    id:'magic1', name:'The Magic Academy',
    params: () => ({school: rngPick(['Thornwick Academy','The Obsidian Tower','Mistral Hall']), spell: rngPick(['Luminara','Tempestus','Verdantis']), professor: rngPick(['Professor Ashwood','Magister Thorne','Dean Hexley'])}),
    screens: (p) => [
      {
        text: `Final exam at ${p.school}: escape the enchanted maze before midnight. ${p.professor} watches from the tower. You stand at the entrance — three paths glow: gold, silver, and green. Your best spell is ${p.spell}.`,
        choices: [
          {text:'Cast ${p.spell} to reveal the true path', optimal:true, next:'Your spell illuminates hidden runes on the gold path. They read: "Wisdom first."'},
          {text:'Take the gold path — gold usually means correct', optimal:false, next:'A trapdoor! You fall into a puzzle chamber. Assumptions are dangerous here.'},
          {text:'Study the runes carved at each entrance', optimal:true, next:'The silver path\'s runes match ${p.spell}\'s sigil. It\'s attuned to your magic.'},
          {text:'Take the green path — nature feels safest', optimal:false, next:'Enchanted vines grab your ankles. You free yourself but lose precious minutes.'}
        ]
      },
      {
        text: `The silver path winds through shifting walls. A sphinx blocks the way and poses a riddle. Behind you, the path is already rearranging itself. Shelves of potion ingredients line one wall.`,
        choices: [
          {text:'Answer the sphinx\'s riddle', optimal:true, next:'Correct! The sphinx bows and the wall opens to the next chamber.'},
          {text:'Brew a quick potion from the ingredients', optimal:true, next:'A revealing potion shows the sphinx is an illusion. You walk right through it.'},
          {text:'Try to climb over the sphinx', optimal:false, next:'The sphinx isn\'t physical but magical. You can\'t climb over a spell.'},
          {text:'Turn back and find another route', optimal:false, next:'The walls shifted. There IS no other route anymore.'}
        ]
      },
      {
        text: `A vast chamber with a floating staircase spiraling upward. Each step plays a musical note. A wrong note collapses the step. ${p.professor}\'s voice echoes: "Harmony is key." A sheet of music rests on a pedestal.`,
        choices: [
          {text:'Read the sheet music and step on matching notes', optimal:true, next:'Do, Mi, Sol, Do. Each step holds firm. You ascend the melodic staircase.'},
          {text:'Cast ${p.spell} to stabilize all the steps', optimal:true, next:'Your magic reinforces the staircase. Every step glows solid. Well done.'},
          {text:'Jump randomly and hope for the best', optimal:false, next:'Three steps in — wrong note. The step vanishes. You grab the railing just in time.'},
          {text:'Try to fly up with a levitation spell', optimal:false, next:'The chamber has an anti-flight enchantment. Classic exam trick. Use the stairs.'}
        ]
      },
      {
        text: `The top of the staircase opens to a mirror room. Your reflection moves independently, mimicking your spells. To pass, you must outsmart your magical double. The exit shimmers behind the central mirror.`,
        choices: [
          {text:'Cast a spell your reflection can\'t copy — something creative', optimal:true, next:'You cast ${p.spell} in reverse. The reflection tries but fizzles. The mirror cracks.'},
          {text:'Step through the central mirror', optimal:false, next:'You bounce off. The mirror is solid until the reflection is dealt with.'},
          {text:'Don\'t cast — challenge it to a non-magical contest', optimal:true, next:'You sit down. The reflection, being magical, doesn\'t understand. It flickers and fades.'},
          {text:'Blast every mirror with force', optimal:false, next:'Seven years bad luck times twelve mirrors. Also, they regenerate.'}
        ]
      },
      {
        text: `Beyond the mirrors: the final chamber. A pedestal holds the exam token — a crystal orb. But a time enchantment ticks toward midnight. ${p.professor}\'s final test: the orb is behind a magical lock with three keyholes.`,
        choices: [
          {text:'Use the runes, the music notes, and the riddle answer as keys', optimal:true, next:'Each lesson was a key! The lock clicks open. You grab the orb. ${p.professor} applauds from the tower. You pass!'},
          {text:'Cast ${p.spell} with everything you have', optimal:true, next:'Your strongest casting shatters the lock. Raw power counts too. The orb is yours!'},
          {text:'Try to pick the magical lock manually', optimal:false, next:'Magical locks don\'t have physical mechanisms. You need magic or knowledge.'},
          {text:'Wait for another student to solve it and follow them', optimal:false, next:'This is a solo exam. No other students are in your maze instance.'}
        ]
      }
    ]
  },
  {
    id:'circus1', name:'The Abandoned Circus',
    params: () => ({circus: rngPick(['Cirque Noir','The Forgotten Big Top','Midnight Carnival']), clown: rngPick(['Grimaldi','Mr. Chuckles','Patches']), prize: rngPick(['a golden ticket','the ringmaster\'s key','a diamond brooch'])}),
    screens: (p) => [
      {
        text: `${p.circus} has been abandoned for decades, yet tonight the lights are on. You entered seeking ${p.prize}, rumored to be hidden here. The big top entrance looms ahead. A ticket booth and a side show tent flank it. A painted face of ${p.clown} watches from a poster.`,
        choices: [
          {text:'Check the ticket booth for clues', optimal:true, next:'An old map of the circus grounds is pinned behind the counter. Attractions marked.'},
          {text:'Enter the big top directly', optimal:false, next:'The big top is dark and vast. Without a plan, you wander the empty ring.'},
          {text:'Explore the side show tent first', optimal:true, next:'The tent holds mirrors, fortune-telling machines, and a lockbox with a note: "Hall of Mirrors holds the truth."'},
          {text:'Call out to see if anyone is here', optimal:false, next:'Calliope music starts playing on its own. Unsettling, not helpful.'}
        ]
      },
      {
        text: `The map shows: Hall of Mirrors, the Funhouse, the Ferris Wheel, and the Ringmaster\'s Wagon. The note mentioned mirrors. But the funhouse has a direct path to backstage where valuables were stored.`,
        choices: [
          {text:'Go to the Hall of Mirrors — follow the clue', optimal:true, next:'Distorted reflections everywhere. But one mirror doesn\'t reflect at all — it\'s a door.'},
          {text:'Check the Ringmaster\'s Wagon', optimal:true, next:'Locked, but through the window you see a safe. ${p.prize} might be inside.'},
          {text:'Take the funhouse shortcut', optimal:false, next:'Spinning floors and tilted rooms. You stumble out dizzy and disoriented.'},
          {text:'Climb the Ferris Wheel for a better view', optimal:false, next:'The structure groans. Decades of rust. It\'s not safe to climb.'}
        ]
      },
      {
        text: `Behind the mirror-door: a hidden passage to the backstage area. Props and costumes everywhere. A ${p.clown} costume hangs on a rack, and a trapdoor is cut into the floor. A safe code is written on a chalkboard: the number of rings in the big top times the number of Ferris wheel cars.`,
        choices: [
          {text:'Figure out the code: 3 rings, 12 cars = 36', optimal:true, next:'The chalkboard equation checks out. You note 36 for the safe.'},
          {text:'Open the trapdoor to see what\'s below', optimal:true, next:'A tunnel under the big top. Performers used this to appear and disappear. It connects everywhere.'},
          {text:'Put on the ${p.clown} costume as a disguise', optimal:false, next:'Disguise from whom? The circus is abandoned. Just a creepy outfit.'},
          {text:'Search every prop for hidden items', optimal:false, next:'Hundreds of props. You waste time finding nothing but fake flowers and rubber chickens.'}
        ]
      },
      {
        text: `Through the tunnel, you reach the Ringmaster\'s Wagon from below. The safe is here. The combo lock needs a number. Outside, the calliope music grows louder. Something moves in the shadows.`,
        choices: [
          {text:'Enter 36 on the combination lock', optimal:true, next:'Click. The safe opens. ${p.prize} gleams inside. You grab it.'},
          {text:'Listen carefully to identify the shadow movement', optimal:true, next:'Just a cat. An actual circus cat, still living here. Harmless.'},
          {text:'Try random numbers on the safe', optimal:false, next:'After five wrong attempts, the lock seizes. Should have done the math.'},
          {text:'Forget the safe and flee the circus', optimal:false, next:'You came for ${p.prize}. Don\'t leave empty-handed when you\'re this close.'}
        ]
      },
      {
        text: `${p.prize} in hand, you need to exit. The way you came is through the tunnels. The wagon door opens to the fairground. The big top entrance is closest to the parking lot. ${p.clown}\'s poster seems to grin wider.`,
        choices: [
          {text:'Exit through the wagon door and walk to the parking lot', optimal:true, next:'Fresh night air. Your car is right where you left it. ${p.prize} secured. Adventure complete!'},
          {text:'Use the tunnel system to reach the main entrance unseen', optimal:true, next:'The tunnels lead right to the ticket booth. Out the front, into the night. Success.'},
          {text:'Go through the big top for a final look', optimal:false, next:'A spotlight activates on its own in the ring. Time to leave, not sightsee.'},
          {text:'Look for more hidden valuables before leaving', optimal:false, next:'Greed in an abandoned circus at night. Nothing good comes from pushing your luck.'}
        ]
      }
    ]
  },
  {
    id:'skyscraper1', name:'Skyscraper Fire Escape',
    params: () => ({building: rngPick(['Apex Tower','The Meridian','Skyline One']), floor: rngInt(40,75), company: rngPick(['Vertex Corp','Helix Industries','Pinnacle Tech'])}),
    screens: (p) => [
      {
        text: `Fire alarm at ${p.building}, floor ${p.floor}. You\'re working late at ${p.company}. Smoke curls under the office door. The elevator panel shows OUT OF SERVICE. Stairwell A is left, Stairwell B is right. The window shows emergency lights far below.`,
        choices: [
          {text:'Check both stairwell doors for heat before choosing', optimal:true, next:'Stairwell A\'s door is hot — fire below. Stairwell B is cool. Go right.'},
          {text:'Take Stairwell B immediately', optimal:false, next:'You rush in without checking. Luckily B is clear, but you should have checked for heat.'},
          {text:'Grab your go-bag and wet a cloth for smoke', optimal:true, next:'Wet cloth over your face cuts the smoke. Your bag has a flashlight. Prepared.'},
          {text:'Try the elevator — maybe it still works', optimal:false, next:'Elevators in a fire are death traps. Never use them. The panel is right.'}
        ]
      },
      {
        text: `Stairwell B, heading down from floor ${p.floor}. At floor ${p.floor - 10}, the stairwell is blocked by debris. Smoke is rising. A door leads back to that floor\'s office space. A maintenance hatch is above you.`,
        choices: [
          {text:'Go through the office to reach Stairwell A on the other side', optimal:true, next:'The office is smoky but passable. Stairwell A is clear from this floor down.'},
          {text:'Open the maintenance hatch and climb up one floor', optimal:true, next:'Above the debris, the stairwell is clear again. You bypass the blockage.'},
          {text:'Try to clear the debris', optimal:false, next:'Concrete and steel. You can\'t move it by hand. Find another way.'},
          {text:'Go back up to your floor and wait for rescue', optimal:false, next:'Going up in a fire means going toward heat and smoke. Keep descending.'}
        ]
      },
      {
        text: `Floor ${p.floor - 25}. The fire is below you on floors 10-15. Smoke is thickening. You meet other evacuees. A fire warden says the lobby is blocked. The parking garage on B1 or the skybridge on floor 20 to the adjacent building are alternatives.`,
        choices: [
          {text:'Head for the skybridge on floor 20', optimal:true, next:'Five more floors down. The skybridge connects to ${p.building} West. Clear air on the other side.'},
          {text:'Follow the warden\'s lead — they know the building', optimal:true, next:'The warden leads the group to a refuge floor with fire-rated walls and fresh air supply.'},
          {text:'Go to the parking garage in the basement', optimal:false, next:'That means going THROUGH the fire floors. The warden shakes their head. Too dangerous.'},
          {text:'Break a window for fresh air', optimal:false, next:'At this height, wind feeds the fire. Broken windows make things worse.'}
        ]
      },
      {
        text: `The skybridge is ahead on floor 20. But floor 22\'s corridor is hazy with smoke. Your wet cloth is drying out. The group is 8 people strong. A fire hose cabinet and a ventilation shaft are nearby.`,
        choices: [
          {text:'Rewet the cloth at the fire hose', optimal:true, next:'The hose connection provides water. Everyone wets their face coverings. Two more floors.'},
          {text:'Stay low and move fast through the smoke', optimal:true, next:'Crawling under the smoke layer, the group reaches floor 20. Breathable air returns.'},
          {text:'Take the ventilation shaft as a shortcut', optimal:false, next:'Shafts channel smoke like chimneys. Getting in one is extremely dangerous.'},
          {text:'Wait here for firefighters', optimal:false, next:'Smoke is thickening. Firefighters may be floors away. Keep moving.'}
        ]
      },
      {
        text: `Floor 20. The skybridge door is locked with a security badge reader. Smoke seeps from below. Through the glass, you see the adjacent building — safety is 30 meters away. A fire axe is behind glass nearby.`,
        choices: [
          {text:'Use the fire axe on the badge reader mechanism', optimal:true, next:'One swing. The lock disengages. The group rushes across the skybridge to safety!'},
          {text:'Search for a security badge on this floor', optimal:true, next:'A guard station has a universal access badge. Door opens. Everyone crosses safely.'},
          {text:'Try to break through the skybridge glass walls', optimal:false, next:'The glass is reinforced. The axe would be better used on the door.'},
          {text:'Go back and try another route down', optimal:false, next:'There\'s no time. The smoke is rising. The skybridge is your best option.'}
        ]
      }
    ]
  },
  {
    id:'library1', name:'The Ancient Library',
    params: () => ({library: rngPick(['The Library of Shadows','Athenaeum Obscura','The Forbidden Archive']), book: rngPick(['the Codex of Stars','the Grimoire of Ages','the Scroll of Eternity']), guardian: rngPick(['the Stone Golem','the Spectral Librarian','the Sphinx of Knowledge'])}),
    screens: (p) => [
      {
        text: `${p.library} was sealed for centuries. You\'ve found the entrance — a reading room lit by magical torches. Shelves tower impossibly high. ${p.guardian} is said to protect ${p.book}. A catalog desk and a winding staircase are visible.`,
        choices: [
          {text:'Check the catalog desk for ${p.book}\'s location', optimal:true, next:'A magical index card floats up: "Section Omega, Third Landing, Behind the Constellation."'},
          {text:'Climb the staircase to explore', optimal:false, next:'Without direction, you wander endless shelves. The library seems to go on forever.'},
          {text:'Read the inscription above the entrance for rules', optimal:true, next:'"Speak softly, solve wisely, take only what is given." The library has rules for a reason.'},
          {text:'Start pulling books off shelves randomly', optimal:false, next:'A book snaps at your fingers. These shelves are enchanted. Careful.'}
        ]
      },
      {
        text: `The winding staircase to the Third Landing. Each landing has a puzzle door. The first shows a riddle in Latin. The second has a lock shaped like a constellation. Books whisper as you pass.`,
        choices: [
          {text:'Solve the Latin riddle — "What has pages but no words?"', optimal:true, next:'"A blank book." The door swings open. Well read, indeed.'},
          {text:'Look for a constellation chart to match the lock', optimal:true, next:'A star map on the ceiling matches the lock perfectly. You align the points.'},
          {text:'Force the doors with brute strength', optimal:false, next:'The doors are magically reinforced. Force triggers a defensive ward that pushes you back.'},
          {text:'Skip the doors and climb the outside of the staircase', optimal:false, next:'The staircase exists in folded space. There is no "outside" to climb.'}
        ]
      },
      {
        text: `The Third Landing. Section Omega stretches before you — books bound in metal, leather, and light. "Behind the Constellation" — a shelf shaped like Orion stands at the far wall. ${p.guardian} stirs nearby.`,
        choices: [
          {text:'Approach quietly and study the constellation shelf', optimal:true, next:'Behind the Orion shelf, a hidden alcove. ${p.book} rests on a velvet stand.'},
          {text:'Address ${p.guardian} respectfully', optimal:true, next:'${p.guardian} rumbles: "State your purpose." "I seek ${p.book} for knowledge, not power." "Then proceed."'},
          {text:'Try to sneak past ${p.guardian}', optimal:false, next:'${p.guardian} detects all movement in Section Omega. You\'re caught immediately.'},
          {text:'Create a distraction to lure ${p.guardian} away', optimal:false, next:'${p.guardian} doesn\'t leave its post. Ever. Distractions are irrelevant.'}
        ]
      },
      {
        text: `${p.book} is before you, glowing faintly. But it\'s chained to the stand with an enchanted lock. Three symbols on the lock match elements from the puzzles you solved. ${p.guardian} watches impassively.`,
        choices: [
          {text:'Enter the symbols from the riddle, constellation, and inscription', optimal:true, next:'The chain dissolves. ${p.book} floats gently into your hands. ${p.guardian} nods.'},
          {text:'Ask ${p.guardian} for permission to remove the chain', optimal:true, next:'"You solved the trials. The chain recognizes the worthy." It falls away.'},
          {text:'Break the chain with a tool', optimal:false, next:'The chain absorbs force and redirects it. Your tool flies across the room.'},
          {text:'Try to read ${p.book} while it\'s still chained', optimal:false, next:'The pages remain blank until the chain is properly removed.'}
        ]
      },
      {
        text: `${p.book} in hand. But ${p.library} is shifting — shelves rearrange, stairs fold. The exit is closing. ${p.guardian} points to a reading alcove that glows with exit light.`,
        choices: [
          {text:'Run to the glowing alcove', optimal:true, next:'The alcove is a portal. You step through and emerge outside, ${p.book} safely in your arms.'},
          {text:'Follow the library\'s rules — walk, don\'t run', optimal:true, next:'You walk calmly. The library respects those who follow its rules. The exit stays open for you.'},
          {text:'Try to find the original staircase', optimal:false, next:'The staircase has moved. The library is alive and rearranging. Trust the guardian.'},
          {text:'Grab more books on the way out', optimal:false, next:'"Take only what is given." The rule. Extra books fly from your hands. Greed is punished here.'}
        ]
      }
    ]
  },
  {
    id:'mine1', name:'The Deep Mine Collapse',
    params: () => ({mine: rngPick(['Copper Ridge Mine','Shaft 14','Ironheart Colliery']), mineral: rngPick(['gold','copper','silver']), depth: rngInt(200,500)}),
    screens: (p) => [
      {
        text: `${p.mine}, ${p.depth} meters underground. A rumble, then darkness — the main shaft has collapsed behind you. Your headlamp flickers. You\'re in a ${p.mineral} vein chamber. Rail tracks lead deeper. A ventilation shaft runs overhead.`,
        choices: [
          {text:'Follow the ventilation shaft — it leads to the surface', optimal:true, next:'The vent shaft angles upward. Fresh air flows from ahead. Good sign.'},
          {text:'Follow the rail tracks — they lead to another exit', optimal:true, next:'Rails mean miners went this way regularly. An emergency exit should be along this route.'},
          {text:'Try to dig through the collapse', optimal:false, next:'Tons of rock. Your hands can\'t move what explosives created. Find another way.'},
          {text:'Stay put and wait for rescue', optimal:false, next:'No one knows exactly where you are in the mine. Self-rescue is faster.'}
        ]
      },
      {
        text: `Along the tracks, you reach a junction. Left branch is flooded knee-deep. Right branch is dry but you hear settling rock. An emergency supply box is bolted to the wall. A cage elevator sits in a shaft, cables dangling.`,
        choices: [
          {text:'Open the emergency supply box', optimal:true, next:'A radio, flares, a first aid kit, and a map of the mine levels. Jackpot.'},
          {text:'Take the dry right branch carefully', optimal:true, next:'You move slowly, listening for shifts. The tunnel is stable enough. It opens to a larger gallery.'},
          {text:'Try the cage elevator', optimal:false, next:'The cable is frayed. The cage drops two meters before jamming. Nope.'},
          {text:'Wade through the flooded left branch', optimal:false, next:'The water is freezing and gets deeper. Waist-high. Turn back before it\'s over your head.'}
        ]
      },
      {
        text: `The mine map shows you\'re on Level 4. The emergency exit is on Level 2 — a spiral ramp connects them through Level 3. Your radio picks up static on the rescue frequency. A natural cavern opens to the left.`,
        choices: [
          {text:'Transmit your location on the rescue frequency', optimal:true, next:'"Rescue team copies! Level 4, junction B. Stay on route to Level 2. We\'re clearing from above."'},
          {text:'Take the spiral ramp up to Level 3', optimal:true, next:'The ramp is steep but solid. Level 3 is brighter — emergency lighting still works here.'},
          {text:'Explore the natural cavern', optimal:false, next:'Beautiful limestone formations but it\'s a dead end. No connection to upper levels.'},
          {text:'Try to climb up through the elevator shaft', optimal:false, next:'A vertical shaft with frayed cables and no ladder. Far too dangerous.'}
        ]
      },
      {
        text: `Level 3. The ramp to Level 2 is partially blocked by a recent rockfall — small rocks, passable with effort. You hear drilling from above — rescue team is close. Air quality is dropping; your headlamp dims.`,
        choices: [
          {text:'Carefully clear a path through the small rockfall', optimal:true, next:'Stone by stone, you create a gap. Squeeze through. Level 2 is just ahead.'},
          {text:'Use a flare to signal rescuers through cracks in the rock', optimal:true, next:'Red light seeps through. Rescuers see it: "We see your flare! Hold position, breaking through."'},
          {text:'Blast through with something from the supply box', optimal:false, next:'No explosives in the supply box. And blasting could cause another collapse.'},
          {text:'Go back and try the flooded tunnel on Level 4', optimal:false, next:'Going deeper when rescue is above you makes no sense. Keep going up.'}
        ]
      },
      {
        text: `Level 2. The emergency exit is a reinforced tunnel leading to the surface. Daylight glimmers at the end. The rescue team\'s drill breaks through a wall section nearby. Two ways out.`,
        choices: [
          {text:'Walk toward the daylight through the emergency tunnel', optimal:true, next:'Fresh air hits your face. Sunlight blinds you. You emerge to cheers. Rescued!'},
          {text:'Meet the rescue team at their drill point', optimal:true, next:'They break through. Helmets and headlamps. "Gotcha!" They guide you out safely.'},
          {text:'Run as fast as you can', optimal:false, next:'Tripping in a mine is how injuries happen. Walk briskly, not recklessly.'},
          {text:'Go back to collect ${p.mineral} samples first', optimal:false, next:'Your life vs. rock samples. The mine will be here later. Get out now.'}
        ]
      }
    ]
  },
  {
    id:'zombie1', name:'Zombie Mall Escape',
    params: () => ({mall: rngPick(['Westfield Plaza','Sunrise Mall','The Galleria']), store: rngPick(['the sporting goods store','the hardware store','the pharmacy']), vehicle: rngPick(['a pickup truck','a delivery van','an SUV'])}),
    screens: (p) => [
      {
        text: `${p.mall} during the outbreak. You\'re barricaded in ${p.store} on the second floor. The power is out. Through the shutters, you see zombies shuffling through the atrium. ${p.vehicle} is visible in the parking lot. You need to reach it.`,
        choices: [
          {text:'Search ${p.store} for useful supplies and weapons', optimal:true, next:'You find a sturdy bat, rope, duct tape, and energy bars. Well-equipped now.'},
          {text:'Study the zombie patrol patterns from the shutters', optimal:true, next:'They move in loose circles. A gap opens every 3 minutes near the east corridor.'},
          {text:'Lift the shutters and make a run for it', optimal:false, next:'The shutter rattles loudly. Every zombie in earshot turns your way.'},
          {text:'Barricade further and wait for military rescue', optimal:false, next:'The radio went silent hours ago. No rescue is coming to ${p.mall}.'}
        ]
      },
      {
        text: `Timing the gap, you slip into the east corridor. The escalators are frozen mid-step. A maintenance hallway runs behind the stores. Below, the food court swarms with undead. The parking garage stairs are on the far side.`,
        choices: [
          {text:'Use the maintenance hallway — less exposed', optimal:true, next:'Behind the storefronts, you move unseen. Service corridors connect the whole mall.'},
          {text:'Descend the frozen escalator quietly', optimal:false, next:'Each metal step creaks. A zombie at the bottom turns toward the sound.'},
          {text:'Create a distraction — toss something into the food court', optimal:true, next:'An energy bar clatters across the tile. The horde shuffles toward the noise. Window open.'},
          {text:'Sprint across the atrium bridge', optimal:false, next:'Completely exposed. Multiple zombies spot you from below and start climbing.'}
        ]
      },
      {
        text: `The maintenance corridor leads to a loading dock behind the mall. ${p.vehicle} is in the main lot — you need to cross the parking garage. Emergency lights create pools of red. You hear groaning from the garage shadows.`,
        choices: [
          {text:'Move through the lit areas between cars, staying quiet', optimal:true, next:'Car to car, light to light. The groaning stays distant. You cross undetected.'},
          {text:'Check if any cars in the garage have keys', optimal:true, next:'A delivery van has keys in the visor. Closer than ${p.vehicle}, but any escape works.'},
          {text:'Sound a car alarm to draw zombies away from your path', optimal:false, next:'The alarm draws them TO the garage, not away. Now they\'re between you and the exits.'},
          {text:'Run through the dark section — speed over stealth', optimal:false, next:'You crash into a zombie in the dark. Wrestling free costs you your bat.'}
        ]
      },
      {
        text: `You reach ${p.vehicle}. Keys were hidden in the wheel well (preppers think of everything). But a small group of zombies blocks the parking lot exit. The gas gauge shows half full. Engine noise will attract more.`,
        choices: [
          {text:'Start the engine and drive straight through', optimal:true, next:'The engine roars. You floor it. Zombies bounce off the bumper. The exit gate shatters.'},
          {text:'Release the parking brake and coast silently toward the exit first', optimal:true, next:'Silent and slow, you roll past the group. Start the engine once past them. Clever.'},
          {text:'Honk to scatter them', optimal:false, next:'Honking attracts dozens more from the mall. Now the lot is filling up.'},
          {text:'Wait for them to wander away', optimal:false, next:'More keep coming. The lot isn\'t getting emptier. Act now or never.'}
        ]
      },
      {
        text: `On the road out of ${p.mall}. The highway has abandoned cars but is navigable. In the rearview, the mall shrinks. A road sign shows two routes: Highway 9 through town, or the rural Route 17.`,
        choices: [
          {text:'Take Route 17 — fewer people means fewer zombies', optimal:true, next:'Open road, empty fields. You drive until ${p.mall} is a distant memory. Safe at last.'},
          {text:'Take Highway 9 but stay alert for blockages', optimal:true, next:'Weaving through abandoned cars, you reach the evacuation checkpoint. Military rescue!'},
          {text:'Go back for other survivors in the mall', optimal:false, next:'Noble but suicidal. You barely made it out. Send help back properly.'},
          {text:'Stop at a gas station to top off', optimal:false, next:'Gas stations are chokepoints. Half a tank is enough. Keep moving.'}
        ]
      }
    ]
  },
  {
    id:'ghostship1', name:'The Ghost Ship',
    params: () => ({ship: rngPick(['The Mary Celeste','The Flying Dutchman','HMS Specter']), captain: rngPick(['Captain Ashford','Captain Grimshaw','Captain Moreau']), cargo: rngPick(['silk and spices','gold bullion','ancient artifacts'])}),
    screens: (p) => [
      {
        text: `You board ${p.ship}, adrift for decades. ${p.captain}\'s log lies open on the deck. The cargo hold supposedly contains ${p.cargo}. Fog rolls across the deck. The wheelhouse and the crew quarters are accessible. Something moves below deck.`,
        choices: [
          {text:`Read ${p.captain}'s log for clues`, optimal:true, next:`The final entry: "Something in the cargo hold. Crew won't go below. I must investigate alone." The entry stops mid-sentence.`},
          {text:'Head to the wheelhouse to check navigation', optimal:true, next:'Charts show the last known position. The radio is dead but a signal flare gun sits in a cabinet.'},
          {text:'Go below deck immediately to investigate', optimal:false, next:'Dark, creaking timbers. Without light or knowledge of the layout, you stumble into a locked bulkhead.'},
          {text:'Jump back to your own boat', optimal:false, next:'Your boat has drifted away in the fog. You\'re stuck on ${p.ship} now.'}
        ]
      },
      {
        text: `${p.captain}\'s quarters hold a locked chest, a navigational sextant, and photos of the crew. A key hangs on a chain around a mounted portrait. The ship groans and lists slightly. Water sloshes somewhere below.`,
        choices: [
          {text:'Take the key from behind the portrait', optimal:true, next:'The key is ornate and old. It might open the chest or a door below deck.'},
          {text:'Open the locked chest', optimal:false, next:'Without the key, you can\'t open it. Check around the room first.'},
          {text:'Study the crew photos for clues', optimal:true, next:'Seven crew, but eight hammocks below. Someone — or something — extra was aboard.'},
          {text:'Take the sextant to navigate off the ship later', optimal:false, next:'You don\'t know how to use a sextant. Focus on what helps you now.'}
        ]
      },
      {
        text: `Below deck. The key opens the crew quarters — empty hammocks sway with the ship\'s motion. ${p.cargo} crates are visible through a grated floor. A strange glow emanates from the deepest hold. The eighth hammock has claw marks.`,
        choices: [
          {text:'Investigate the glow in the deep hold carefully', optimal:true, next:'The glow comes from a crate marked with warning symbols. Inside: a bioluminescent artifact.'},
          {text:'Check if the cargo hold is taking on water', optimal:true, next:'A small breach. Not critical yet, but the bilge pump needs to be activated or the ship will sink.'},
          {text:'Search the claw-marked hammock', optimal:false, next:'Just torn fabric and the smell of something feral. Nothing useful, everything unsettling.'},
          {text:'Open all the cargo crates', optimal:false, next:'Most are nailed shut and you have no tools. The one glowing crate is accessible though.'}
        ]
      },
      {
        text: `The artifact pulses with light — it seems to be the cause of the ship\'s haunting. The bilge pump control is in the engine room. The ship lists further. You hear the fog horn sound on its own. The deck hatch is your way up.`,
        choices: [
          {text:'Activate the bilge pump to stabilize the ship', optimal:true, next:'The engine room pump chugs to life. Water levels drop. The listing corrects.'},
          {text:'Take the artifact and head topside', optimal:true, next:'With the artifact removed, the ship seems calmer. The fog thins slightly.'},
          {text:'Throw the artifact overboard from here', optimal:false, next:'You\'re below the waterline. There\'s nowhere to throw it overboard from here.'},
          {text:'Explore deeper into the ship', optimal:false, next:'Deeper means more water and less air. Go up, not down.'}
        ]
      },
      {
        text: `Back on deck with the artifact. The fog is thinning. Your boat reappears in the distance. The signal flare gun from the wheelhouse could summon a passing ship, or you could try to reach your own boat.`,
        choices: [
          {text:'Fire the signal flare to attract attention', optimal:true, next:'A red flare arcs over the sea. Within an hour, a coast guard vessel arrives. You\'re rescued with proof of ${p.ship}\'s mystery!'},
          {text:'Lower the lifeboat and row to your vessel', optimal:true, next:'The davits creak but hold. You row through calm water back to your boat. ${p.ship} fades into the fog behind you. Escape complete.'},
          {text:'Try to sail ${p.ship} to port yourself', optimal:false, next:'A ship this size needs a crew. You can\'t sail it solo.'},
          {text:'Stay aboard and study the artifact', optimal:false, next:'The fog is lifting NOW. This is your window. Study the artifact on dry land.'}
        ]
      }
    ]
  }
];

function getEscapePuzzle() {
  const template = rngPickUnseen(ESCAPE_BANK, 'escape', 'id');
  const params = template.params();
  const screens = template.screens(params);
  const diff = GS.difficulty;
  // Adjust choice count by difficulty
  screens.forEach(s => {
    let numChoices;
    switch(diff) {
      case 'easy': numChoices = 2; break;
      case 'medium': numChoices = 3; break;
      case 'hard': numChoices = rngInt(3,4); break;
      case 'extreme': numChoices = 4; break;
      case 'impossible': numChoices = 5; break;
    }
    // Always keep at least 1 optimal and 1 non-optimal
    const optimalChoices = s.choices.filter(c => c.optimal);
    const suboptimalChoices = s.choices.filter(c => !c.optimal);
    let kept = [];
    kept.push(rngPick(optimalChoices));
    if (numChoices > 1 && suboptimalChoices.length > 0) {
      kept.push(rngPick(suboptimalChoices));
    }
    // Fill remaining
    const remaining = s.choices.filter(c => !kept.includes(c));
    const shuffledRemaining = rngShuffle(remaining);
    while (kept.length < numChoices && shuffledRemaining.length > 0) {
      kept.push(shuffledRemaining.shift());
    }
    s.choices = rngShuffle(kept);
  });
  return { name: template.name, screens, params };
}

function renderEscape(puzzle) {
  GS.challengeState.escape = { puzzle, screenIdx: 0, score: 0, choices: [] };
  renderEscapeScreen();
}

function renderEscapeScreen() {
  const state = GS.challengeState.escape;
  const screen = state.puzzle.screens[state.screenIdx];
  const c = document.getElementById('game-container');
  let html = `<div class="escape-progress">`;
  for (let i = 0; i < 5; i++) {
    const cls = i < state.screenIdx ? 'done' : i === state.screenIdx ? 'active' : '';
    html += `<div class="escape-dot ${cls}"></div>`;
  }
  html += `</div>`;
  html += `<div class="escape-narrative" id="escape-text"></div>`;
  html += `<div class="escape-choices" id="escape-choices">`;
  screen.choices.forEach((ch, i) => {
    html += `<button class="escape-choice" onclick="selectEscapeChoice(${i})">${ch.text}</button>`;
  });
  html += `</div>`;
  html += `<div id="escape-feedback"></div>`;
  html += `<button class="btn btn-primary btn-full" id="btn-escape-next" onclick="advanceEscape()" style="display:none;margin-top:16px">Next →</button>`;
  c.innerHTML = html;
  document.getElementById('btn-submit-challenge').style.display = 'none';
  // Typewriter effect
  typewriterText('escape-text', screen.text, 20);
}

function typewriterText(elemId, text, speed) {
  const el = document.getElementById(elemId);
  el.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(type, speed);
    }
  }
  type();
  // Also allow clicking to skip
  el.onclick = () => { el.textContent = text; el.onclick = null; };
}

function selectEscapeChoice(idx) {
  const state = GS.challengeState.escape;
  const screen = state.puzzle.screens[state.screenIdx];
  const choice = screen.choices[idx];
  state.choices.push(choice);
  if (choice.optimal) state.score += 20;
  // Visual feedback
  const btns = document.querySelectorAll('.escape-choice');
  btns.forEach((b, i) => {
    b.disabled = true;
    if (i === idx) {
      b.classList.add(choice.optimal ? 'optimal' : 'suboptimal');
    }
  });
  const fb = document.getElementById('escape-feedback');
  if (choice.optimal) {
    fb.innerHTML = `<div class="escape-feedback" style="background:rgba(106,170,100,0.1);color:var(--green)">
      ✓ Good choice! ${choice.next}
    </div>`;
  } else {
    // Pause timer on wrong answer
    pauseTimer();
    state.timerPaused = true;
    // Highlight the correct answer
    const optIdx = screen.choices.findIndex(c => c.optimal);
    if (optIdx !== -1) btns[optIdx].classList.add('optimal');
    const optChoice = screen.choices.find(c => c.optimal);
    fb.innerHTML = `<div class="escape-feedback" style="background:rgba(245,158,11,0.1);color:var(--orange)">
      ⚠ Not optimal. ${choice.next}
    </div>
    <div class="escape-feedback" style="background:rgba(106,170,100,0.1);color:var(--green);margin-top:8px">
      ✓ Better choice: "${optChoice.text}" — ${optChoice.next}
    </div>`;
  }
  // Show next button
  document.getElementById('btn-escape-next').style.display = 'block';
}

function advanceEscape() {
  const state = GS.challengeState.escape;
  if (state.timerPaused) { resumeTimer(); state.timerPaused = false; }
  state.screenIdx++;
  if (state.screenIdx < 5) {
    renderEscapeScreen();
  } else {
    // Done
    GS.results.escape = state.score;
    if (GS.mode === 'daily') {
      setDailyCompletion('escape', state.score);
      lsSet('daily-escape-state-'+getDailyDateStr(), { score: state.score, choices: state.choices.map(ch => ({ text: ch.text, optimal: ch.optimal })) });
    }
    const choiceReview = state.choices.map((ch, i) =>
      `<div class="cs-choice"><span>${ch.optimal ? '✓' : '✗'}</span><span style="flex:1">${ch.text}</span></div>`
    ).join('');
    showChallengeSummary({
      emoji: state.score >= 80 ? '🎉' : state.score >= 40 ? '👍' : '🚪',
      score: state.score,
      title: state.score >= 80 ? 'Great Escape!' : state.score >= 40 ? 'You Made It!' : 'Barely Escaped',
      stats: [
        { label: 'Optimal choices', value: `${state.score / 20} / 5` }
      ],
      miniReview: choiceReview
    });
  }
}

