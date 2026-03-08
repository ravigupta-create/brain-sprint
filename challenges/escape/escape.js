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
  }
];

function getEscapePuzzle() {
  const template = rngPick(ESCAPE_BANK);
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

