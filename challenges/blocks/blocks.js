// ==================== CHALLENGE 1: LOGIC BLOCKS ====================
const BLOCKS_BANK = [
  // level 1 = everyday knowledge (easy+)
  {
    id:'recipe_bread', name:'Baking Bread', level:1,
    steps:['Mix flour, yeast, salt, and water','Knead the dough for 10 minutes','Let the dough rise for 1 hour','Punch down and shape the loaf','Let it rise again for 30 minutes','Preheat oven to 375°F','Bake for 30-35 minutes','Cool on a wire rack before slicing'],
    distractors:['Add baking soda and vinegar','Freeze the dough overnight']
  },
  {
    id:'cake_bake', name:'Baking a Cake', level:1,
    steps:['Preheat oven to 350°F','Cream butter and sugar together','Beat in eggs one at a time','Mix in vanilla extract','Combine dry ingredients separately','Alternate adding dry mix and milk to batter','Pour into greased pans','Bake for 25-30 minutes and cool before frosting'],
    distractors:['Add raw meat to the batter','Bake at 600°F for 5 minutes']
  },
  {
    id:'fire_build', name:'Building a Campfire', level:1,
    steps:['Clear the area and create a fire ring','Gather tinder (dry leaves, paper)','Collect kindling (small twigs)','Prepare fuel wood (larger logs)','Place tinder in the center','Arrange kindling in a teepee shape over tinder','Light the tinder','Gradually add larger pieces of fuel wood'],
    distractors:['Pour gasoline on everything','Start with the largest logs']
  },
  {
    id:'plant_grow', name:'Growing a Plant from Seed', level:1,
    steps:['Select appropriate seeds for the season','Prepare soil with nutrients','Plant seeds at the correct depth','Water the soil gently','Ensure adequate sunlight exposure','Thin seedlings once they sprout','Fertilize as plants grow','Harvest when mature'],
    distractors:['Plant seeds on concrete','Water with saltwater']
  },
  {
    id:'first_aid', name:'Treating a Minor Wound', level:1,
    steps:['Wash your hands thoroughly','Apply gentle pressure to stop bleeding','Clean the wound with clean water','Apply antibiotic ointment','Cover with a sterile bandage','Change the bandage daily','Watch for signs of infection','Seek medical care if it worsens'],
    distractors:['Apply dirt to the wound','Ignore it completely']
  },
  {
    id:'essay_write', name:'Writing an Essay', level:1,
    steps:['Understand the prompt or question','Research and gather sources','Create a thesis statement','Outline the main arguments','Write the introduction','Develop body paragraphs with evidence','Write the conclusion','Proofread and revise'],
    distractors:['Submit without reading it','Copy from the internet']
  },
  {
    id:'cpr_steps', name:'Performing CPR', level:1,
    steps:['Check the scene for safety','Check if the person is responsive','Call emergency services (911)','Place person on their back on a firm surface','Put heel of hand on center of chest','Push hard and fast (100-120 compressions/min)','Give 2 rescue breaths after 30 compressions','Continue until help arrives'],
    distractors:['Give the person water','Check their temperature first']
  },
  {
    id:'recycle', name:'Recycling Process', level:1,
    steps:['Consumer places item in recycling bin','Collection truck picks up recyclables','Materials transported to recycling facility','Items sorted by material type','Materials cleaned and processed','Processed into raw material form','Raw materials sold to manufacturers','New products created from recycled materials'],
    distractors:['Dump everything in landfill','Burn all materials']
  },
  {
    id:'laundry', name:'Doing Laundry', level:1,
    steps:['Sort clothes by color and fabric type','Check pockets for items','Load clothes into the washing machine','Add detergent','Select the wash cycle and temperature','Start the machine','Move clean clothes to the dryer','Fold and put away when dry'],
    distractors:['Wash everything in hot water','Add bleach to colored clothes']
  },
  {
    id:'make_sandwich', name:'Making a Sandwich', level:1,
    steps:['Gather bread, protein, and toppings','Lay out two slices of bread','Spread condiments on the bread','Add lettuce and tomato','Layer on the meat or protein','Add cheese if desired','Place the top slice of bread','Cut in half and serve'],
    distractors:['Toast the lettuce','Put ice cream inside']
  },
  {
    id:'brush_teeth', name:'Brushing Your Teeth', level:1,
    steps:['Wet your toothbrush','Apply toothpaste to the brush','Brush the outer surfaces of teeth','Brush the inner surfaces of teeth','Brush the chewing surfaces','Brush your tongue gently','Spit out the toothpaste','Rinse your mouth with water'],
    distractors:['Swallow the toothpaste','Use soap instead of toothpaste']
  },
  {
    id:'mail_letter', name:'Mailing a Letter', level:1,
    steps:['Write your letter or card','Fold it and place in an envelope','Seal the envelope','Write the recipient address in the center','Write your return address in the top left','Attach the correct postage stamp','Take it to a mailbox or post office','The postal service delivers it'],
    distractors:['Put the letter in the trash','Leave the envelope open']
  },
  {
    id:'morning_routine', name:'Getting Ready for School', level:1,
    steps:['Wake up when your alarm goes off','Get out of bed and stretch','Brush your teeth and wash your face','Get dressed in your clothes','Eat breakfast','Pack your backpack','Put on shoes and jacket','Head out the door'],
    distractors:['Go back to sleep','Skip breakfast and lunch']
  },
  {
    id:'flat_tire', name:'Changing a Flat Tire', level:1,
    steps:['Pull over to a safe, flat spot','Turn on hazard lights','Get the spare tire and jack from the trunk','Loosen the lug nuts slightly','Place the jack and raise the car','Remove the lug nuts and flat tire','Put on the spare tire','Lower the car and tighten the lug nuts'],
    distractors:['Keep driving on the flat','Remove the tire while the car is on the ground']
  },
  // level 2 = general knowledge (medium+)
  {
    id:'sci_method', name:'The Scientific Method', level:2,
    steps:['Observe a phenomenon','Form a question','Research existing knowledge','Formulate a hypothesis','Design and conduct an experiment','Analyze the data','Draw conclusions','Communicate results'],
    distractors:['Skip to publishing results','Choose the data that fits']
  },
  {
    id:'democracy_law', name:'How a Bill Becomes Law', level:2,
    steps:['A member of Congress introduces the bill','Bill is assigned to a committee','Committee reviews, amends, and votes','Bill goes to the full chamber for debate','Chamber votes on the bill','If passed, sent to the other chamber','Both chambers reconcile differences','President signs or vetoes the bill'],
    distractors:['The president writes the bill alone','Citizens vote directly on each bill']
  },
  {
    id:'startup_launch', name:'Launching a Startup', level:2,
    steps:['Identify a problem worth solving','Research the market and competitors','Build a minimum viable product (MVP)','Get feedback from early users','Iterate based on feedback','Develop a business model','Seek funding or revenue','Scale the product and team'],
    distractors:['Rent a large office immediately','Hire 50 employees before launch']
  },
  {
    id:'recipe_pasta', name:'Making Fresh Pasta', level:2,
    steps:['Mound flour on a clean surface','Create a well in the center','Crack eggs into the well','Beat eggs with a fork gradually mixing flour','Knead until smooth and elastic','Wrap in plastic and rest 30 minutes','Roll out thin with a rolling pin','Cut into desired shape and cook 2-3 minutes'],
    distractors:['Boil the flour first','Add yeast to make it rise']
  },
  {
    id:'photo_digital', name:'Taking a Great Photo', level:2,
    steps:['Assess the available light','Choose an interesting composition','Set appropriate camera settings','Focus on the subject','Check the background for distractions','Take the photo at the right moment','Review the image on screen','Post-process for color and exposure'],
    distractors:['Always use maximum zoom','Cover the lens with your finger']
  },
  {
    id:'chess_open', name:'A Standard Chess Opening', level:2,
    steps:['Control the center with a pawn move (e4 or d4)','Develop knights before bishops','Castle early to protect the king','Connect the rooks by developing all pieces','Avoid moving the same piece twice in opening','Don\'t bring the queen out too early','Establish pawn structure','Transition into the middlegame'],
    distractors:['Move the rook pawns first','Sacrifice the queen on move 2']
  },
  {
    id:'photo_process', name:'Developing Film Photography', level:2,
    steps:['Expose film to light through camera','Remove film from camera in darkroom','Submerge film in developer solution','Rinse in stop bath','Fix the image with fixer solution','Wash thoroughly with water','Hang to dry in dust-free area','Print onto photographic paper'],
    distractors:['Expose the film to sunlight','Scan the negative with a printer']
  },
  // level 3 = technical (hard/extreme only)
  {
    id:'algo_bubble', name:'Bubble Sort Algorithm', level:3,
    steps:['Start with an unsorted array','Compare adjacent elements','If left > right, swap them','Move to the next pair','Repeat until end of array','If any swaps occurred, restart from beginning','Array is now sorted'],
    distractors:['Divide the array in half','Pick a random pivot element']
  },
  {
    id:'algo_binary', name:'Binary Search', level:3,
    steps:['Start with a sorted array','Set low=0 and high=length-1','Calculate mid = (low+high)/2','Compare target with array[mid]','If equal, return mid','If target < array[mid], set high=mid-1','If target > array[mid], set low=mid+1','Repeat until low > high'],
    distractors:['Sort the array first','Swap low and high pointers']
  },
  {
    id:'algo_dijkstra', name:'Dijkstra\'s Shortest Path', level:3,
    steps:['Set distance to source as 0, all others as infinity','Add all nodes to unvisited set','Pick unvisited node with smallest distance','For each neighbor, calculate tentative distance','If tentative distance < current, update it','Mark current node as visited','Repeat until destination is visited or set is empty'],
    distractors:['Sort all edges by weight first','Remove the longest edge']
  },
  {
    id:'web_request', name:'HTTP Request Lifecycle', level:3,
    steps:['User enters URL in browser','Browser performs DNS lookup','TCP connection established (3-way handshake)','Browser sends HTTP request','Server processes the request','Server sends HTTP response','Browser parses HTML','Browser renders the page'],
    distractors:['Browser compiles the JavaScript to machine code','Server sends email notification']
  },
  {
    id:'compile_run', name:'Compiling & Running Code', level:3,
    steps:['Write source code in a text editor','Save the file with correct extension','Run the preprocessor (if applicable)','Compile source code to object code','Link object code with libraries','Generate executable binary','Load executable into memory','CPU executes the instructions'],
    distractors:['Email the code to the compiler','Print the code on paper first']
  },
  {
    id:'git_workflow', name:'Git Feature Branch Workflow', level:3,
    steps:['Pull latest changes from main branch','Create a new feature branch','Write code and make changes','Stage changes with git add','Commit with a descriptive message','Push branch to remote','Open a pull request for review','Merge into main after approval'],
    distractors:['Delete the main branch','Force push directly to production']
  },
  {
    id:'algo_merge', name:'Merge Sort', level:3,
    steps:['If array has one element, it is sorted','Divide the array into two halves','Recursively sort the left half','Recursively sort the right half','Create an empty result array','Compare front elements of both halves','Add the smaller element to result','Repeat until all elements are merged'],
    distractors:['Swap random elements','Sort each element individually']
  },
  {
    id:'debug_process', name:'Debugging a Program', level:3,
    steps:['Reproduce the bug consistently','Read the error message carefully','Identify the relevant code section','Add logging or use a debugger','Form a hypothesis about the cause','Test the hypothesis with a fix','Verify the fix doesn\'t break other things','Document what caused the bug'],
    distractors:['Delete all the code','Restart the computer repeatedly']
  },
  {
    id:'ml_pipeline', name:'Machine Learning Pipeline', level:3,
    steps:['Define the problem and success metric','Collect and clean the dataset','Perform exploratory data analysis','Split data into train/validation/test sets','Select and train a model','Tune hyperparameters on validation set','Evaluate on the test set','Deploy the model to production'],
    distractors:['Test on the training data','Skip data cleaning']
  },
  {
    id:'tcp_handshake', name:'TCP Three-Way Handshake', level:3,
    steps:['Client sends SYN packet to server','Server receives SYN','Server sends SYN-ACK packet back','Client receives SYN-ACK','Client sends ACK packet','Server receives ACK','Connection is established','Data transfer begins'],
    distractors:['Client sends data before connecting','Server ignores all packets']
  },
  // === NEW LEVEL 1 TEMPLATES (everyday tasks) ===
  {
    id:'wash_car', name:'Washing a Car', level:1,
    steps:['Park the car in the shade','Rinse the car with water to remove loose dirt','Fill a bucket with soapy water','Wash from top to bottom with a sponge','Scrub the wheels and tires','Rinse off all the soap','Dry with a clean microfiber towel','Apply wax for extra shine'],
    distractors:['Use sandpaper on the paint','Wash in direct sunlight with dish soap']
  },
  {
    id:'boil_egg', name:'Boiling Eggs', level:1,
    steps:['Place eggs in a single layer in a pot','Cover eggs with cold water by an inch','Place pot on the stove and turn to high heat','Bring water to a rolling boil','Remove from heat and cover with a lid','Let sit for 10-12 minutes','Transfer eggs to an ice bath','Peel and serve when cool'],
    distractors:['Crack the eggs before boiling','Microwave the eggs in their shells']
  },
  {
    id:'iron_shirt', name:'Ironing a Shirt', level:1,
    steps:['Fill the iron with water and heat it up','Set the iron to the correct fabric temperature','Start with the collar, pressing flat','Iron the shoulder yoke area','Iron one sleeve, then the other','Iron the front panels','Iron the back of the shirt','Hang immediately on a hanger'],
    distractors:['Iron while the shirt is still wet and dripping','Use the iron on the highest setting for all fabrics']
  },
  {
    id:'paint_room', name:'Painting a Room', level:1,
    steps:['Move furniture away from walls','Lay down drop cloths on the floor','Apply painter\'s tape around trim and edges','Stir the paint thoroughly','Cut in the edges and corners with a brush','Use a roller to paint large wall areas','Apply a second coat after the first dries','Remove tape and clean up'],
    distractors:['Paint over the electrical outlets','Skip the primer on bare drywall']
  },
  {
    id:'make_coffee', name:'Brewing Pour-Over Coffee', level:1,
    steps:['Boil fresh filtered water','Grind coffee beans to medium-fine','Place a filter in the dripper','Rinse the filter with hot water','Add ground coffee to the filter','Pour a small amount of water to bloom the grounds','Slowly pour remaining water in circles','Let it drip through and serve'],
    distractors:['Use cold water for brewing','Add the grounds after pouring the water']
  },
  {
    id:'wrap_gift', name:'Wrapping a Gift', level:1,
    steps:['Choose wrapping paper that fits the gift','Measure and cut the paper with extra for overlap','Place the gift face-down on the paper','Fold one side over the gift and tape it','Fold the other side over and tape it down','Fold the end flaps into triangles','Tape the triangular flaps neatly','Add a bow or ribbon on top'],
    distractors:['Use newspaper and leave the price tag on','Wrap with the pattern facing inward']
  },
  {
    id:'set_table', name:'Setting a Dinner Table', level:1,
    steps:['Lay a placemat or tablecloth','Place the dinner plate in the center','Set the fork on the left side','Place the knife and spoon on the right','Put the drinking glass above the knife','Place the napkin on or beside the plate','Add salt, pepper, and any condiments','Light a candle or add a centerpiece'],
    distractors:['Put the fork on top of the glass','Place the plate on the floor']
  },
  {
    id:'pack_suitcase', name:'Packing a Suitcase', level:1,
    steps:['Check the weather at your destination','Make a packing list','Lay out all clothing items','Roll or fold clothes to save space','Place heavy items at the bottom','Pack toiletries in a sealed bag','Fill gaps with socks and small items','Keep essentials in your carry-on'],
    distractors:['Pack your entire closet','Leave toiletries open in the suitcase']
  },
  {
    id:'grocery_shop', name:'Grocery Shopping', level:1,
    steps:['Check what you already have at home','Make a list organized by store section','Bring reusable bags','Start with non-perishable aisles','Pick up refrigerated items next','Get frozen items last','Check expiration dates before buying','Unpack and store groceries at home'],
    distractors:['Buy everything that looks interesting','Leave frozen food in the car for hours']
  },
  {
    id:'wash_dishes', name:'Washing Dishes by Hand', level:1,
    steps:['Scrape leftover food into the trash','Fill the sink with hot soapy water','Wash glasses and cups first','Wash plates and bowls next','Scrub pots and pans last','Rinse all items under clean water','Place on a drying rack','Wipe down the sink and counters'],
    distractors:['Use cold water and no soap','Stack dirty dishes back in the cabinet']
  },
  {
    id:'sew_button', name:'Sewing on a Button', level:1,
    steps:['Thread a needle and knot the end','Position the button on the fabric','Push needle up through the fabric and button hole','Push needle down through the opposite hole','Repeat 4-6 times to secure','Wrap thread around the shank under the button','Push needle to the back of the fabric','Tie a knot and cut the thread'],
    distractors:['Use a stapler instead','Glue the button with superglue']
  },
  {
    id:'mow_lawn', name:'Mowing the Lawn', level:1,
    steps:['Check the lawn for debris and obstacles','Set the mower blade to the right height','Fill the mower with gas or charge the battery','Start mowing in straight parallel rows','Overlap each pass slightly','Mow around the edges and obstacles','Empty the grass clippings bag as needed','Clean the mower and store it away'],
    distractors:['Mow when the grass is soaking wet','Set the blade to the lowest possible setting']
  },
  {
    id:'make_bed', name:'Making the Bed', level:1,
    steps:['Remove all pillows and decorative items','Straighten the fitted sheet','Pull up the flat sheet evenly','Add the blanket or comforter on top','Tuck the bottom edges under the mattress','Fold the top edge neatly','Place pillows at the head of the bed','Add any decorative pillows or throws'],
    distractors:['Put the pillows under the mattress','Sleep on top of the comforter']
  },
  {
    id:'plan_party', name:'Planning a Birthday Party', level:1,
    steps:['Choose a date and venue','Create a guest list','Send out invitations','Plan the menu and order a cake','Buy decorations and supplies','Set up the venue on the day','Greet guests and serve food','Open presents and cut the cake'],
    distractors:['Don\'t tell anyone the date','Forget to order food']
  },
  {
    id:'cook_rice', name:'Cooking Rice on the Stove', level:1,
    steps:['Measure the desired amount of rice','Rinse the rice under cold water','Add rice to a pot with the correct water ratio','Bring the water to a boil','Reduce heat to low and cover with a lid','Simmer for 18 minutes without lifting the lid','Remove from heat and let stand 5 minutes','Fluff with a fork and serve'],
    distractors:['Stir the rice constantly while cooking','Boil the rice without a lid']
  },
  {
    id:'clean_bathroom', name:'Cleaning a Bathroom', level:1,
    steps:['Gather cleaning supplies','Spray cleaner on the shower and tub','Squirt cleaner inside the toilet bowl','Wipe down the mirror and sink','Scrub the shower and tub surfaces','Scrub the toilet inside and out','Mop or wipe the floor','Take out the trash and replace the liner'],
    distractors:['Use the same cloth for toilet and sink','Spray cleaner on the toilet paper']
  },
  {
    id:'make_smoothie', name:'Making a Smoothie', level:1,
    steps:['Gather fresh or frozen fruit','Add fruit to the blender','Pour in liquid (milk, juice, or water)','Add yogurt or protein powder if desired','Add a handful of ice if using fresh fruit','Blend on high until smooth','Taste and adjust sweetness','Pour into a glass and serve'],
    distractors:['Blend without the lid on','Add whole unpeeled bananas']
  },
  {
    id:'fly_trip', name:'Taking a Flight', level:1,
    steps:['Book your flight ticket','Pack your bags within weight limits','Arrive at the airport 2 hours early','Check in and drop off luggage','Go through security screening','Find your gate and wait for boarding','Board the plane and find your seat','Buckle your seatbelt for takeoff'],
    distractors:['Show up 5 minutes before departure','Pack liquids in your carry-on without limits']
  },
  {
    id:'unclog_drain', name:'Unclogging a Drain', level:1,
    steps:['Remove the drain cover or stopper','Pull out visible debris by hand','Pour boiling water down the drain','Add baking soda and let it sit','Pour vinegar and wait for fizzing to stop','Flush with more boiling water','Use a plunger if still clogged','Test the drain with running water'],
    distractors:['Pour concrete down the drain','Ignore it and use a different sink']
  },
  {
    id:'make_omelet', name:'Making an Omelet', level:1,
    steps:['Crack eggs into a bowl and whisk','Add a splash of milk, salt, and pepper','Heat butter in a non-stick pan over medium heat','Pour the egg mixture into the pan','Let eggs set on the bottom for a minute','Add fillings to one half','Fold the omelet in half with a spatula','Slide onto a plate and serve'],
    distractors:['Whisk the eggs in the frying pan','Cook on maximum heat for speed']
  },
  {
    id:'jump_start_car', name:'Jump-Starting a Car', level:1,
    steps:['Park the working car next to the dead one','Turn off both vehicles','Attach red cable to dead battery positive terminal','Attach other red cable to good battery positive terminal','Attach black cable to good battery negative terminal','Attach other black cable to unpainted metal on dead car','Start the working car and wait a few minutes','Start the dead car and remove cables in reverse order'],
    distractors:['Connect positive to negative terminals','Pour water on the battery']
  },
  {
    id:'make_pizza_dough', name:'Making Pizza Dough', level:1,
    steps:['Dissolve yeast in warm water with sugar','Let it sit until foamy (5 minutes)','Mix flour, salt, and olive oil in a bowl','Add the yeast mixture to the flour','Knead the dough for 8 minutes until smooth','Place in an oiled bowl and cover','Let rise for 1 hour until doubled','Punch down, stretch, and shape the crust'],
    distractors:['Use boiling water with the yeast','Freeze the dough before it rises']
  },
  {
    id:'organize_closet', name:'Organizing a Closet', level:1,
    steps:['Remove everything from the closet','Sort items into keep, donate, and discard piles','Clean the empty closet shelves and floor','Group similar items together','Place frequently used items at eye level','Store seasonal items up high or in back','Use bins or dividers for small items','Put everything back in an organized layout'],
    distractors:['Throw everything on the floor and leave it','Stuff everything in without sorting']
  },
  {
    id:'bbq_grill', name:'Grilling Burgers', level:1,
    steps:['Form ground beef into evenly sized patties','Season both sides with salt and pepper','Preheat the grill to medium-high heat','Oil the grill grates','Place patties on the grill','Flip after 4-5 minutes','Add cheese in the last minute if desired','Remove when internal temperature reaches 160\u00B0F'],
    distractors:['Press the patties flat with a spatula constantly','Grill while the burgers are still frozen solid']
  },
  {
    id:'tie_necktie', name:'Tying a Necktie', level:1,
    steps:['Drape the tie around your collar with the wide end longer','Cross the wide end over the narrow end','Bring the wide end under the narrow end','Cross the wide end over again','Pull the wide end up through the neck loop','Tuck the wide end down through the front knot','Tighten by pulling the narrow end down','Adjust the knot up to the collar'],
    distractors:['Tie it in a bow like a shoelace','Wrap it around your waist']
  },
  // === NEW LEVEL 2 TEMPLATES (general knowledge) ===
  {
    id:'water_cycle', name:'The Water Cycle', level:2,
    steps:['Sun heats surface water in oceans and lakes','Water evaporates into water vapor','Water vapor rises and cools in the atmosphere','Vapor condenses into tiny droplets forming clouds','Droplets combine and grow heavier','Precipitation falls as rain, snow, or hail','Water flows into rivers and groundwater','Water returns to oceans and the cycle repeats'],
    distractors:['Water disappears permanently into space','The moon pulls water into the sky']
  },
  {
    id:'play_production', name:'Staging a Theater Production', level:2,
    steps:['Select a script or write an original play','Hold auditions and cast the roles','Begin rehearsals with script read-throughs','Block the scenes (plan movement on stage)','Design and build sets and costumes','Run technical rehearsals with lights and sound','Perform dress rehearsals','Open night: perform for the audience'],
    distractors:['Skip rehearsals and improvise everything','Build the set after the show opens']
  },
  {
    id:'trial_court', name:'A Criminal Court Trial', level:2,
    steps:['Charges are formally filed by the prosecutor','Jury selection (voir dire) takes place','Both sides give opening statements','Prosecution presents its case and witnesses','Defense presents its case and witnesses','Both sides give closing arguments','Judge instructs the jury on the law','Jury deliberates and delivers a verdict'],
    distractors:['The defendant picks the jury members','The judge decides guilt before the trial']
  },
  {
    id:'song_record', name:'Recording a Song', level:2,
    steps:['Write the lyrics and compose the melody','Arrange the song for instruments and vocals','Set up microphones and recording equipment','Record the instrumental tracks','Record the vocal tracks','Mix the tracks (balance levels, add effects)','Master the final recording','Distribute on streaming platforms'],
    distractors:['Record everything on a phone speaker','Skip mixing and release the raw tracks']
  },
  {
    id:'oil_painting', name:'Creating an Oil Painting', level:2,
    steps:['Stretch and prime the canvas with gesso','Sketch the composition lightly in pencil','Block in large areas with thin paint (underpainting)','Build up mid-tones and basic colors','Add details and refine shapes','Apply highlights and deepest shadows','Blend edges and adjust color harmony','Let the painting dry and apply varnish'],
    distractors:['Use watercolors on top of oil paint','Frame the painting while the paint is wet']
  },
  {
    id:'earthquake_prep', name:'Earthquake Preparedness', level:2,
    steps:['Identify safe spots in each room (under sturdy furniture)','Secure heavy furniture to walls','Create an emergency supply kit','Store water (one gallon per person per day)','Establish a family communication plan','Learn how to shut off gas and water','Practice drop, cover, and hold on drills','Keep shoes and a flashlight by the bed'],
    distractors:['Run outside during the shaking','Stand next to a window for a better view']
  },
  {
    id:'make_film', name:'Making a Short Film', level:2,
    steps:['Write the screenplay','Create a storyboard for each scene','Scout locations and cast actors','Plan the shooting schedule','Shoot all scenes with camera and sound crew','Review footage and select the best takes','Edit the footage and add sound/music','Color grade and export the final film'],
    distractors:['Film scenes in random order without a script','Use your phone flash as the only light source']
  },
  {
    id:'solar_system', name:'Formation of the Solar System', level:2,
    steps:['A giant molecular cloud existed in space','A nearby supernova sent shockwaves through the cloud','The cloud began to collapse under its own gravity','The collapsing cloud formed a spinning disk','The center heated up and became the proto-Sun','Dust grains in the disk collided and stuck together','Rocky planets formed close to the Sun, gas giants further out','Nuclear fusion ignited and the Sun was born'],
    distractors:['The planets were captured from another star','The Sun formed after the planets did']
  },
  {
    id:'train_marathon', name:'Training for a Marathon', level:2,
    steps:['Get a physical checkup from a doctor','Choose a 16-20 week training plan','Build a base with easy runs (3-4 miles)','Gradually increase weekly long run distance','Add tempo runs and interval training','Peak with a 20-mile long run','Taper training two weeks before race day','Run the marathon at your target pace'],
    distractors:['Run a full 26 miles every day','Skip all training and just show up']
  },
  {
    id:'make_pottery', name:'Making a Clay Pot on a Wheel', level:2,
    steps:['Wedge the clay to remove air bubbles','Center the clay on the spinning wheel','Open the clay by pressing thumbs into the center','Pull up the walls evenly','Shape the pot to desired form','Cut the pot off the wheel with a wire','Let the pot dry to leather-hard stage','Fire in a kiln and glaze'],
    distractors:['Put wet clay directly in the kiln','Spin the wheel as fast as possible']
  },
  {
    id:'stock_invest', name:'Investing in the Stock Market', level:2,
    steps:['Set a clear financial goal and timeline','Build an emergency fund first','Open a brokerage account','Research companies or index funds','Diversify across different sectors','Start investing regularly (dollar-cost averaging)','Monitor performance periodically','Rebalance your portfolio as needed'],
    distractors:['Put all your money in one stock','Sell everything when the market dips slightly']
  },
  {
    id:'volcano_erupt', name:'How a Volcano Erupts', level:2,
    steps:['Magma forms deep in the Earth\'s mantle','Magma rises through cracks in the crust','Pressure builds in the magma chamber','Dissolved gases in the magma expand','The pressure exceeds the strength of the rock above','An eruption sends lava, ash, and gas into the air','Lava flows down the volcano\'s slopes','Ash and debris settle, adding new layers of rock'],
    distractors:['The volcano is powered by underground fire','Volcanoes only erupt during earthquakes']
  },
  {
    id:'write_song', name:'Writing a Pop Song', level:2,
    steps:['Choose a theme or emotional concept','Write the chord progression','Compose the verse melody','Develop a catchy chorus hook','Write the bridge for contrast','Craft the lyrics to match the melody','Arrange the song structure (verse-chorus-verse-chorus-bridge-chorus)','Record a demo to finalize the song'],
    distractors:['Write the lyrics before having any melody idea','Make every section sound exactly the same']
  },
  {
    id:'brew_beer', name:'Brewing Beer', level:2,
    steps:['Heat water and steep crushed grains (mashing)','Strain out the grains to get the wort','Bring the wort to a boil and add hops','Boil for 60 minutes','Cool the wort rapidly to room temperature','Transfer to a fermenter and add yeast','Ferment for 1-2 weeks at stable temperature','Bottle or keg the beer with priming sugar'],
    distractors:['Add yeast while the wort is boiling','Skip fermentation and drink the wort']
  },
  {
    id:'photo_comp', name:'Composing a Photograph', level:2,
    steps:['Visualize the frame divided into a 3x3 grid','Identify the main subject of your photo','Place the subject along one of the grid lines','Position the horizon on the top or bottom third line','Use leading lines to guide the viewer\'s eye','Check the background for clutter','Leave space in the direction the subject faces','Take the shot and review the composition'],
    distractors:['Always center the subject perfectly','Fill the entire frame with the sky']
  },
  {
    id:'bake_sourdough', name:'Baking Sourdough Bread', level:2,
    steps:['Feed your sourdough starter until active and bubbly','Mix starter, flour, water, and salt into a dough','Perform stretch-and-folds every 30 minutes for 2 hours','Let the dough bulk ferment for 4-6 hours','Shape the dough into a boule or batard','Place in a banneton and cold-proof overnight','Preheat oven with a Dutch oven to 500\u00B0F','Score the top and bake covered, then uncovered'],
    distractors:['Use commercial yeast instead of the starter','Bake the dough without letting it rise']
  },
  {
    id:'surf_lesson', name:'Learning to Surf', level:2,
    steps:['Choose a beginner-friendly beach with small waves','Wax the top of your surfboard for grip','Practice the pop-up motion on the sand','Wade into the water with the board','Paddle out past the breaking waves','Turn around and wait for a wave','Paddle hard as the wave approaches','Pop up to your feet and ride the wave'],
    distractors:['Start on the biggest waves you can find','Stand up on the board before entering the water']
  },
  {
    id:'chess_endgame', name:'King and Rook vs King Checkmate', level:2,
    steps:['Use your rook to restrict the opposing king to one side','Bring your king toward the center','Push the opposing king to the edge of the board','Keep your rook cutting off escape squares','Walk your king to support the rook','Drive the opposing king to the corner','Deliver checkmate with the rook on the back rank','Verify it is checkmate, not stalemate'],
    distractors:['Sacrifice your rook immediately','Move your king to the corner instead']
  },
  {
    id:'scuba_dive', name:'Preparing for a Scuba Dive', level:2,
    steps:['Get certified through a diving course','Check weather and dive site conditions','Inspect all gear: BCD, regulator, tank, mask, fins','Assemble and test the equipment','Plan the dive: depth, time, buddy signals','Enter the water and perform a buddy check','Descend slowly, equalizing ear pressure','Follow the dive plan and ascend slowly with a safety stop'],
    distractors:['Dive alone without telling anyone','Hold your breath while ascending']
  },
  {
    id:'cpr_dog', name:'Performing CPR on a Dog', level:2,
    steps:['Check if the dog is breathing and has a pulse','Lay the dog on its right side on a flat surface','Extend the head and neck to open the airway','Place hands over the widest part of the ribcage','Compress the chest 1-1.5 inches at 100-120 per minute','Give 1 rescue breath after every 30 compressions','Check for pulse every 2 minutes','Continue until the dog breathes or help arrives'],
    distractors:['Give the dog chocolate to revive it','Compress the dog\'s stomach instead']
  },
  // === NEW LEVEL 3 TEMPLATES (technical) ===
  {
    id:'docker_deploy', name:'Deploying with Docker', level:3,
    steps:['Write a Dockerfile defining the app environment','Build the Docker image with docker build','Tag the image with a version number','Push the image to a container registry','Write a docker-compose or Kubernetes config','Pull the image on the production server','Run the container with proper port mappings','Verify the app is running with health checks'],
    distractors:['Run the app without a container','Delete the Dockerfile after building']
  },
  {
    id:'sql_normalize', name:'Database Normalization (to 3NF)', level:3,
    steps:['Identify all data attributes and their dependencies','Create a single table with all attributes (unnormalized)','Remove repeating groups to achieve First Normal Form','Ensure all non-key columns depend on the entire primary key (2NF)','Remove transitive dependencies (3NF)','Create separate tables for each entity','Define primary keys for each table','Establish foreign key relationships between tables'],
    distractors:['Put all data in one massive spreadsheet','Delete duplicate rows without analysis']
  },
  {
    id:'neural_net', name:'Training a Neural Network', level:3,
    steps:['Define the network architecture (layers, neurons, activations)','Initialize weights randomly','Feed a batch of training data forward through the network','Compute the loss using a loss function','Backpropagate the error through the network','Update weights using gradient descent','Repeat for many epochs until loss converges','Evaluate on a held-out test set'],
    distractors:['Set all weights to zero','Train on the test set']
  },
  {
    id:'pcr_dna', name:'PCR (Polymerase Chain Reaction)', level:3,
    steps:['Mix DNA template, primers, nucleotides, and DNA polymerase','Heat to 94-98\u00B0C to denature (separate) DNA strands','Cool to 50-65\u00B0C to anneal primers to the template','Heat to 72\u00B0C for DNA polymerase to extend new strands','One cycle doubles the target DNA','Repeat for 25-35 cycles','Run gel electrophoresis to verify amplification','Analyze the resulting DNA bands'],
    distractors:['Heat to 200\u00B0C to speed up the process','Add RNA polymerase instead of DNA polymerase']
  },
  {
    id:'cicd_pipeline', name:'Setting Up a CI/CD Pipeline', level:3,
    steps:['Store source code in a version control system','Configure a CI server (e.g., GitHub Actions, Jenkins)','Write automated unit and integration tests','Define the build step to compile/package the app','Configure the pipeline to trigger on code push','Add automated testing as a required stage','Set up deployment to staging for verification','Promote to production after tests pass'],
    distractors:['Deploy directly without running tests','Let anyone push to production without review']
  },
  {
    id:'rsa_encrypt', name:'RSA Key Generation & Encryption', level:3,
    steps:['Choose two large prime numbers p and q','Compute n = p \u00D7 q','Compute Euler\'s totient \u03C6(n) = (p-1)(q-1)','Choose public exponent e (commonly 65537)','Compute private exponent d such that e\u00B7d \u2261 1 mod \u03C6(n)','Public key is (n, e), private key is (n, d)','Encrypt: ciphertext = message^e mod n','Decrypt: message = ciphertext^d mod n'],
    distractors:['Use small prime numbers like 2 and 3','Share the private key publicly']
  },
  {
    id:'blood_transfuse', name:'Performing a Blood Transfusion', level:3,
    steps:['Verify the doctor\'s order and patient consent','Collect a blood sample for type and crossmatch','Obtain the correct blood product from the blood bank','Verify patient ID and blood unit at bedside with two nurses','Check the blood type, Rh factor, and expiration','Start the transfusion slowly (first 15 minutes)','Monitor vital signs for adverse reactions','Complete the transfusion and document everything'],
    distractors:['Skip the crossmatch to save time','Transfuse any available blood type']
  },
  {
    id:'compiler_phases', name:'Phases of a Compiler', level:3,
    steps:['Lexical analysis: source code is tokenized','Syntax analysis: tokens are parsed into an AST','Semantic analysis: types and scopes are checked','Intermediate code generation (e.g., three-address code)','Code optimization: redundancies are eliminated','Target code generation: assembly or machine code is produced','Symbol table is maintained throughout all phases','Linker combines object files into an executable'],
    distractors:['Convert directly from source to binary in one step','Run the program before compiling it']
  },
  {
    id:'heart_surgery', name:'Open Heart Bypass Surgery (CABG)', level:3,
    steps:['Administer general anesthesia','Make an incision through the sternum (median sternotomy)','Connect the patient to a heart-lung bypass machine','Stop the heart with a cardioplegic solution','Harvest a vein graft (often from the leg)','Sew the graft to bypass the blocked artery','Restart the heart and wean off bypass machine','Close the sternum with wires and suture the incision'],
    distractors:['Perform surgery while the patient is awake','Skip the heart-lung machine']
  },
  {
    id:'kubernetes_deploy', name:'Deploying to Kubernetes', level:3,
    steps:['Containerize the application with a Dockerfile','Push the container image to a registry','Write a Kubernetes Deployment manifest (YAML)','Define a Service to expose the application','Apply manifests with kubectl apply','Kubernetes scheduler assigns pods to nodes','Verify pods are running with kubectl get pods','Set up Ingress for external traffic routing'],
    distractors:['SSH into each node and run the app manually','Delete all pods to redeploy']
  },
  {
    id:'crispr_edit', name:'CRISPR Gene Editing', level:3,
    steps:['Identify the target gene sequence to edit','Design a guide RNA (gRNA) complementary to the target','Synthesize the gRNA and obtain Cas9 protein','Deliver the gRNA-Cas9 complex into the target cells','Cas9 creates a double-strand break at the target site','Cell\'s repair machinery activates (NHEJ or HDR)','If HDR, provide a donor template with the desired edit','Screen and validate edited cells for the correct modification'],
    distractors:['Edit every gene in the genome at once','Use a random RNA sequence as the guide']
  },
  {
    id:'oauth_flow', name:'OAuth 2.0 Authorization Code Flow', level:3,
    steps:['Client redirects user to the authorization server','User logs in and grants permission','Authorization server redirects back with an authorization code','Client sends the code to the authorization server\'s token endpoint','Client includes its client_id and client_secret','Authorization server validates and returns an access token','Client uses the access token to call the resource API','Access token expires; client uses refresh token for a new one'],
    distractors:['Send the user\'s password directly to the API','Store access tokens in plain text in the URL']
  },
  {
    id:'cpu_instruction', name:'CPU Instruction Cycle', level:3,
    steps:['Program counter holds address of next instruction','Fetch: instruction is loaded from memory into IR','Decode: control unit interprets the instruction','Execute: ALU performs the required operation','Memory access: read/write data if needed','Write back: result is stored in a register','Program counter is incremented','Cycle repeats for the next instruction'],
    distractors:['Execute the instruction before fetching it','Store results directly on the hard drive']
  },
  {
    id:'tls_handshake', name:'TLS 1.3 Handshake', level:3,
    steps:['Client sends ClientHello with supported cipher suites and key share','Server selects cipher suite and sends ServerHello with its key share','Server sends its certificate and a CertificateVerify','Server sends Finished message with a MAC of the handshake','Client verifies the server certificate against trusted CAs','Client sends its own Finished message','Both sides derive session keys from the shared secret','Encrypted application data can now be exchanged'],
    distractors:['Send all data in plaintext first','Skip certificate verification']
  },
  {
    id:'rocket_launch', name:'Rocket Launch Sequence', level:3,
    steps:['Complete pre-launch vehicle inspections','Load propellant (fuel and oxidizer) into the tanks','Begin automated countdown sequence','Verify all systems are go at T-10 minutes','Ignite main engines at T-6 seconds','Confirm full thrust and release launch clamps at T-0','Vehicle clears the tower and begins gravity turn','Stage separation occurs and upper stage ignites'],
    distractors:['Launch without checking weather conditions','Ignite engines after leaving the ground']
  },
  {
    id:'regex_engine', name:'How a Regex Engine Matches', level:3,
    steps:['Parse the regex pattern into an abstract syntax tree','Convert the AST to a nondeterministic finite automaton (NFA)','Optionally convert NFA to a deterministic finite automaton (DFA)','Start at the initial state with the input string','For each character, transition to the next state','If no valid transition, backtrack (NFA) or reject','If the engine reaches an accepting state, return a match','Report the matched substring and capture groups'],
    distractors:['Compare the entire string at once with no states','Process the pattern in reverse order']
  },
  {
    id:'pcb_manufacture', name:'Printed Circuit Board Manufacturing', level:3,
    steps:['Design the schematic and PCB layout in EDA software','Export Gerber files for manufacturing','Laminate copper foil onto the substrate','Apply photoresist and expose with UV through a mask','Develop the photoresist to reveal the copper pattern','Etch away unwanted copper with acid','Drill holes for through-hole components','Apply solder mask, silkscreen, and surface finish'],
    distractors:['Draw the circuit with a marker on cardboard','Skip the etching step and solder directly']
  },
  {
    id:'mri_scan', name:'How an MRI Scan Works', level:3,
    steps:['Patient lies inside the strong magnetic field of the MRI','Hydrogen atoms in the body align with the magnetic field','Radiofrequency pulses are applied to knock atoms out of alignment','When the pulse stops, atoms realign and emit RF signals','Receiver coils detect the emitted signals','A computer processes signals based on relaxation times (T1, T2)','Different tissues produce different signal intensities','The computer reconstructs a detailed cross-sectional image'],
    distractors:['The MRI uses X-rays to create the image','The patient must swallow a camera']
  },
  {
    id:'blockchain_tx', name:'How a Blockchain Transaction Works', level:3,
    steps:['Sender creates a transaction and signs it with their private key','Transaction is broadcast to the peer-to-peer network','Nodes validate the transaction (signature, balance, format)','Valid transactions are collected into a candidate block','A miner/validator solves the consensus challenge','The new block is appended to the blockchain','Other nodes verify and accept the new block','The transaction is considered confirmed after several blocks'],
    distractors:['A central bank approves each transaction','Transactions are stored in a single database']
  },
  {
    id:'vaccine_develop', name:'Vaccine Development Process', level:3,
    steps:['Identify the pathogen and its antigens','Develop candidate vaccines in the laboratory','Conduct preclinical testing in cell cultures and animals','Phase I clinical trial: test safety in a small group','Phase II clinical trial: test efficacy and dosage','Phase III clinical trial: large-scale effectiveness study','Submit data to regulatory agency for approval','Mass-produce and distribute the vaccine'],
    distractors:['Skip animal testing and go straight to humans','Release the vaccine without clinical trials']
  },
  {
    id:'fpga_design', name:'FPGA Design Flow', level:3,
    steps:['Write the hardware description in VHDL or Verilog','Simulate the design with a testbench','Synthesize the design into a gate-level netlist','Run place-and-route to map onto FPGA resources','Perform timing analysis to verify clock constraints','Generate the bitstream file','Program the FPGA with the bitstream via JTAG','Validate the design on the physical hardware'],
    distractors:['Write the design in Python and compile it','Skip simulation and program directly']
  },
  {
    id:'spinal_tap', name:'Performing a Lumbar Puncture', level:3,
    steps:['Obtain informed consent from the patient','Position the patient in lateral decubitus or seated','Identify the L3-L4 or L4-L5 interspace by palpation','Sterilize the area and apply local anesthetic','Insert the spinal needle with stylet through the skin','Advance through ligaments until a pop is felt (dura)','Remove the stylet and collect cerebrospinal fluid','Withdraw the needle and apply a bandage'],
    distractors:['Insert the needle into the cervical spine','Skip the anesthetic to save time']
  },
  {
    id:'dns_resolution', name:'DNS Resolution Process', level:3,
    steps:['User types a domain name in the browser','Browser checks its local DNS cache','If not cached, query is sent to the recursive resolver','Resolver checks its cache, then queries a root nameserver','Root server refers to the appropriate TLD nameserver','TLD nameserver refers to the authoritative nameserver','Authoritative nameserver returns the IP address','Resolver caches the result and returns it to the browser'],
    distractors:['The browser guesses the IP address','Domain names are stored on the user\'s hard drive']
  },
  {
    id:'mass_spec', name:'Mass Spectrometry Analysis', level:3,
    steps:['Prepare and purify the sample','Introduce the sample into the ionization source','Ionize the molecules (e.g., electrospray or MALDI)','Accelerate ions through an electric field','Separate ions by mass-to-charge ratio in the analyzer','Detect the ions and record their intensities','Generate a mass spectrum (m/z vs. intensity)','Interpret the spectrum to identify the compounds'],
    distractors:['Weigh the sample on a kitchen scale','Heat the sample until it disappears']
  },
  {
    id:'rl_training', name:'Reinforcement Learning Training Loop', level:3,
    steps:['Define the environment, states, actions, and reward function','Initialize the agent\'s policy or value function','Agent observes the current state','Agent selects an action based on its policy','Environment returns the next state and reward','Store the experience (state, action, reward, next state)','Update the policy using the collected experience','Repeat for many episodes until convergence'],
    distractors:['Give the agent the answers directly','Train without any reward signal']
  },
];

function getBlocksPuzzle() {
  const diff = GS.difficulty;
  const maxLevel = diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3;
  const pool = BLOCKS_BANK.filter(b => b.level <= maxLevel);
  const template = rngPickUnseen(pool, 'blocks', 'id');
  let numBlocks, numDistractors;
  switch(diff) {
    case 'easy': numBlocks = 4; numDistractors = 0; break;
    case 'medium': numBlocks = rngInt(5,6); numDistractors = 0; break;
    case 'hard': numBlocks = rngInt(6,7); numDistractors = 1; break;
    case 'extreme': numBlocks = rngInt(7,8); numDistractors = 2; break;
    case 'impossible': numBlocks = 8; numDistractors = 2; break;
  }
  numBlocks = Math.min(numBlocks, template.steps.length);
  // Pick a contiguous subsequence or spread
  const steps = template.steps.slice(0, numBlocks);
  const correctOrder = [...steps];
  let allBlocks = [...steps];
  // Add distractors
  const distractors = rngShuffle(template.distractors).slice(0, numDistractors);
  allBlocks.push(...distractors);
  // Shuffle
  const shuffled = rngShuffle(allBlocks);
  return {
    name: template.name,
    blocks: shuffled,
    correctOrder,
    distractors
  };
}

function renderBlocks(puzzle) {
  GS.challengeState.blocks = {
    puzzle,
    currentOrder: [...puzzle.blocks],
    attempts: 0,
    swapSelected: null,
    submitted: false
  };
  const c = document.getElementById('game-container');
  let html = `<div style="margin-bottom:12px"><strong>${puzzle.name}</strong></div>`;
  html += `<div class="blocks-container" id="blocks-container">`;
  puzzle.blocks.forEach((text, i) => {
    html += `<div class="block-item" draggable="true" data-idx="${i}" onclick="tapBlock(${i})">
      <span class="block-handle">⠿</span>
      <span class="block-num">${i+1}</span>
      <span class="block-text">${text}</span>
    </div>`;
  });
  html += `</div>`;
  html += `<div id="blocks-feedback" style="margin-top:8px"></div>`;
  c.innerHTML = html;
  document.getElementById('btn-submit-challenge').style.display = 'inline-flex';
  setupBlocksDragDrop();
}

function setupBlocksDragDrop() {
  const container = document.getElementById('blocks-container');
  if (!container) return;
  // Desktop HTML5 drag-and-drop
  let dragIdx = null;
  container.addEventListener('dragstart', (e) => {
    const item = e.target.closest('.block-item');
    if (!item) return;
    dragIdx = parseInt(item.dataset.idx);
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  container.addEventListener('dragend', (e) => {
    const item = e.target.closest('.block-item');
    if (item) item.classList.remove('dragging');
    document.querySelectorAll('.block-item').forEach(b => b.classList.remove('drag-over'));
  });
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const item = e.target.closest('.block-item');
    if (item) {
      document.querySelectorAll('.block-item').forEach(b => b.classList.remove('drag-over'));
      item.classList.add('drag-over');
    }
  });
  container.addEventListener('drop', (e) => {
    e.preventDefault();
    const item = e.target.closest('.block-item');
    if (!item || dragIdx === null) return;
    const dropIdx = parseInt(item.dataset.idx);
    if (dragIdx !== dropIdx) swapBlocks(dragIdx, dropIdx);
    document.querySelectorAll('.block-item').forEach(b => b.classList.remove('drag-over','dragging'));
    dragIdx = null;
  });
  // Mobile touch drag-and-drop
  const ts = {idx:-1, ghost:null, moved:false, sx:0, sy:0};
  function onTouchMove(e) {
    const t = e.touches[0];
    if (!ts.moved && Math.abs(t.clientX - ts.sx) + Math.abs(t.clientY - ts.sy) > 10) {
      ts.moved = true;
      const src = container.querySelectorAll('.block-item')[ts.idx];
      ts.ghost = src.cloneNode(true);
      ts.ghost.className = 'block-item block-drag-ghost';
      const w = src.offsetWidth;
      ts.ghost.style.width = w + 'px';
      ts.gw = w / 2; ts.gh = 0;
      document.body.appendChild(ts.ghost);
      ts.gh = ts.ghost.offsetHeight / 2;
      src.classList.add('dragging');
    }
    if (ts.moved && ts.ghost) {
      e.preventDefault();
      ts.ghost.style.transform = `translate(${t.clientX - ts.gw}px,${t.clientY - ts.gh}px)`;
      ts.ghost.style.left = '0'; ts.ghost.style.top = '0';
      container.querySelectorAll('.block-item').forEach(b => b.classList.remove('drag-over'));
      ts.ghost.style.pointerEvents = 'none';
      const under = document.elementFromPoint(t.clientX, t.clientY);
      ts.ghost.style.pointerEvents = '';
      if (under) {
        const bi = under.closest('.block-item');
        if (bi) bi.classList.add('drag-over');
      }
    }
  }
  function onTouchEnd(e) {
    if (ts.moved && ts.ghost) {
      const t = e.changedTouches[0];
      ts.ghost.style.pointerEvents = 'none';
      const under = document.elementFromPoint(t.clientX, t.clientY);
      ts.ghost.remove();
      ts.ghost = null;
      container.querySelectorAll('.block-item').forEach(b => b.classList.remove('drag-over','dragging'));
      if (under) {
        const bi = under.closest('.block-item');
        if (bi) {
          const dropIdx = parseInt(bi.dataset.idx);
          if (ts.idx !== dropIdx) swapBlocks(ts.idx, dropIdx);
        }
      }
    }
    ts.idx = -1; ts.moved = false;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  }
  container.querySelectorAll('.block-item').forEach((el, i) => {
    el.addEventListener('touchstart', (e) => {
      if (GS.challengeState.blocks.submitted) return;
      ts.idx = parseInt(el.dataset.idx); ts.moved = false;
      ts.sx = e.touches[0].clientX; ts.sy = e.touches[0].clientY;
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.addEventListener('touchmove', onTouchMove, {passive:false});
      document.addEventListener('touchend', onTouchEnd);
    }, {passive:true});
  });
}

// Tap-to-swap
function tapBlock(idx) {
  const state = GS.challengeState.blocks;
  if (state.submitted) return;
  if (state.swapSelected === null) {
    state.swapSelected = idx;
    updateBlocksUI();
  } else if (state.swapSelected === idx) {
    state.swapSelected = null;
    updateBlocksUI();
  } else {
    swapBlocks(state.swapSelected, idx);
    state.swapSelected = null;
  }
}

function swapBlocks(a, b) {
  const state = GS.challengeState.blocks;
  const arr = state.currentOrder;
  [arr[a], arr[b]] = [arr[b], arr[a]];
  updateBlocksUI();
}

function updateBlocksUI() {
  const state = GS.challengeState.blocks;
  const container = document.getElementById('blocks-container');
  container.innerHTML = '';
  state.currentOrder.forEach((text, i) => {
    const div = document.createElement('div');
    div.className = 'block-item' + (state.swapSelected === i ? ' selected-swap' : '');
    if (state.puzzle.distractors.includes(text)) div.classList.add('distractor');
    div.draggable = true;
    div.dataset.idx = i;
    div.onclick = () => tapBlock(i);
    div.innerHTML = `<span class="block-handle">⠿</span><span class="block-num">${i+1}</span><span class="block-text">${text}</span>`;
    container.appendChild(div);
  });
  setupBlocksDragDrop();
}

function submitBlocks() {
  const state = GS.challengeState.blocks;
  state.attempts++;
  // Remove distractors from user order, check against correct
  const userOrder = state.currentOrder.filter(t => !state.puzzle.distractors.includes(t));
  const correct = state.puzzle.correctOrder;
  let allCorrect = userOrder.length === correct.length;
  if (allCorrect) {
    for (let i = 0; i < correct.length; i++) {
      if (userOrder[i] !== correct[i]) { allCorrect = false; break; }
    }
  }
  // Check distractors are not interspersed (they should be separate)
  // Actually, user just needs correct order of non-distractors. Distractors can be anywhere.
  if (allCorrect) {
    state.submitted = true;
    const score = Math.max(0, 100 - (state.attempts - 1) * 15);
    GS.results.blocks = score;
    if (GS.mode === 'daily') {
      setDailyCompletion('blocks', score);
      lsSet('daily-blocks-state-'+getDailyDateStr(), { attempts: state.attempts, correctOrder: state.puzzle.correctOrder, puzzleName: state.puzzle.name });
    }
    // Highlight correct
    const container = document.getElementById('blocks-container');
    container.querySelectorAll('.block-item').forEach(b => {
      b.style.borderColor = 'var(--green)';
      b.style.background = 'rgba(106,170,100,0.1)';
    });
    setTimeout(() => {
      if (!document.getElementById('game-container')) return;
      const emoji = state.attempts === 1 ? '🏆' : state.attempts <= 3 ? '🎉' : '✅';
      const distractorCount = state.puzzle.distractors ? state.puzzle.distractors.length : 0;
      const stats = [
        { label: 'Attempts', value: state.attempts },
        { label: 'Steps', value: state.puzzle.correctOrder.length }
      ];
      if (distractorCount > 0) stats.push({ label: 'Distractors', value: distractorCount });
      showChallengeSummary({
        emoji,
        score,
        title: state.attempts === 1 ? 'Perfect Order!' : 'Correct!',
        stats
      });
    }, 500);
  } else {
    // Shake
    const container = document.getElementById('blocks-container');
    container.style.animation = 'shake 0.4s';
    setTimeout(() => container.style.animation = '', 400);
    document.getElementById('blocks-feedback').innerHTML = `<div style="color:var(--red)">Not quite right. Try again! (Attempt ${state.attempts})</div>`;
  }
}

