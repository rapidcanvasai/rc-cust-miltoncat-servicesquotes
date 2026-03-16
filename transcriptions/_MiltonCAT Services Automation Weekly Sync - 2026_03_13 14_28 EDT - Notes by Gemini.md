# 📝 Notes

Mar 13, 2026

##  MiltonCAT Services Automation Weekly Sync

Invited [Fuge Zou](mailto:fuge@rapidcanvas.ai) [Ray Hsu](mailto:ray@rapidcanvas.ai) [Davis Gallagher](mailto:davis@rapidcanvas.ai) [Herbert Gomes Miranda](mailto:herbert@rapidcanvas.ai) [Dailey, Tim](mailto:tim_dailey@miltoncat.com) ~~[Lucas Inacio Luz](mailto:lucas.inacio@rapidcanvas.ai)~~

Attachments [ MiltonCAT Services Automation Weekly Sync](https://www.google.com/calendar/event?eid=NGhnbDRtcWRxYWk0NDRyNzFnM2ZscGRkNHBfMjAyNjAzMTFUMTgwMDAwWiBkYXZpc0ByYXBpZGNhbnZhcy5haQ) 

Meeting records [Transcript](?tab=t.msmlxcwegpw8) 

### Summary

Documentation review confirmed price calculation changes with discussions on similarity scores, personal topics, and project status updates.

**Documentation Review Similarity Score**  
Documentation confirmed a positive change where records with 0 prices are now excluded from the average calculation used for quotes. Ideas were discussed for using the similarity score to pull through quote information instead of relying solely on the average of all work order history.

**Meeting Cancellation Project Update**  
The meeting was canceled due to Tim's absence, but a project update confirmed that parts data was successfully joined to the work order history table. The resulting similarity score, based on the framework developed by Luke, is the key element to be integrated into the quote price generation.

**UI UX Enhancements Confirmation**  
The team must update the mobile UI to include the serial prefix toggle and confirm the full workflow, as the system currently lacks write access to push generated quotes to AX. Confirmation regarding the UX lead and AI engineer lead for the Milton cat use cases is required from Utum and Fugun.

### Details

* **Documentation Review and Similarity Score Implementation**: Davis Gallagher acknowledged that the documentation provided by Herbert Gomes Miranda was helpful, which was considered better than trying to translate words to explain concepts \[i\]. Davis Gallagher noted they had ideas regarding using the similarity score to pull through the quote, as the current method relies on the average of all work order history \[i\]. Herbert Gomes Miranda confirmed the price calculation method had recently changed to exclude records with zero prices from the average calculation, a positive change to prevent those zeros from influencing the quote \[i, ii\].

* **Discussion of Pet Health (Poodle Mix)**: The conversation briefly shifted to discuss Davis Gallagher's dog, who is a Pushon, a mix of a poodle and a Bichon \[ii\]. Davis Gallagher noted that their dog is smart like a poodle but also very clingy, often following their mother around the house \[iii\]. Herbert Gomes Miranda mentioned that the Bichon breed looks like a smaller poodle \[iii\].

* **Discussion of Pet Health (Pomeranian)**: Herbert Gomes Miranda provided an update on their Pomeranian puppy, noting that after a vet visit and X-ray, nothing was broken, but the orthopedist suspected patellar dislocation \[iv\]. This condition is common in small breeds like Pomeranians and may require future surgery, although the dog is currently running and jumping but randomly raises a paw \[iv, vi\]. Herbert Gomes Miranda noted that pet health expenses, including a $1,000 bladder stone removal for Davis Gallagher's pet, are significant and costly \[vi, vii\].

* **Headset Discussion and Customer Support**: The participants discussed Herbert Gomes Miranda's Corsair Void headset, which they have owned for five years \[viii\]. Herbert Gomes Miranda shared positive experiences with Corsair's customer support, noting the company sent them replacement ear pads for free four times, even after the warranty expired, and sent a replacement microphone for free after they accidentally broke the original \[ix\]. Davis Gallagher agreed that this represented very good customer support \[ix\].

* **Technology Preferences (Headsets and Operating Systems)**: Herbert Gomes Miranda noted they are usually the only person using a dedicated headset in meetings, while others use AirPods or laptop speakers, and Davis Gallagher mentioned avoiding AirPods due to unreliable microphone quality \[x, xi\]. Davis Gallagher explained that they use a Windows laptop for work because they were accustomed to it from a previous job, despite preferring a Mac for personal use, which turned out to be unnecessary as the current job uses Google Suite \[xi, xii\]. Herbert Gomes Miranda expressed a preference for Windows for personal use and gaming but suggested Mac is better for work productivity \[xii\].

* **Gaming PC Specifications**: The conversation shifted to custom-built PCs, with Davis Gallagher mentioning building a PC with their brother about ten years ago using an i7 processor and a 1040 Ti or 1050 graphics card \[xiii\]. Herbert Gomes Miranda confirmed their gaming computer is Windows-based and that they built their own PC \[xii, xiii\]. Herbert Gomes Miranda noted that they bought and built their PC during the peak of the pandemic, leading to high component prices, such as paying 12–13,000 Brazilian Reals (around $2,500) for the PC \[xiv\].

* **Semiconductor Market and Crypto Investment**: The discussion covered the high prices of PC parts during the pandemic and the impact of companies like Samsung and Micron moving away from consumer RAM to focus on AI graphics card chips \[xv, xvi\]. Herbert Gomes Miranda shared a successful, but brief, experience with crypto games and NFTs during the market bubble, turning a $3,000 investment into about $25,000 in less than a month \[xvii\]. Davis Gallagher noted making a profit on the Ethereum run, but they are no longer investing in crypto \[xviii\].

* **Meeting Cancellation and Project Status Update**: The meeting was canceled due to Tim's continued absence, despite multiple attempts by Davis Gallagher to contact them \[xviii, xix\]. Davis Gallagher provided an update that Herbert Gomes Miranda successfully joined the parts data provided by Tim to the work order history table, creating a similarity score using the framework developed by Luke \[xix\]. The next step involves using the similarity score to inform the quote price, rather than just using the average of prior work orders \[xix\].

* **Roadmap and Next Steps**: Davis Gallagher outlined the next steps for the project: integrating the similarity score into the quote generation, updating the analytics on the right-hand side of the UI based on Tim’s feedback, and updating the mobile UI \[xx\]. Tim confirmed the meeting was canceled but requested a demo be scheduled with the VP \[xx, xxiv\]. The planned demo would be moved from the current week to the following week, specifically from 3 to 4 on Tuesday \[xxvi\].

* **UI/UX Enhancements and Workflows**: Davis Gallagher showed the desktop UI, which is used to generate a quote based on machine model, job code, and component code, and noted that Tim requested changes to the right-hand analytics to show the frequency of specific combinations (e.g., machine/job/component) to help determine candidates for standard jobs \[xxi, xxii\]. The mobile app UI needs to be updated to include the serial prefix toggle, which is currently missing \[xxiii\]. The team needs to confirm the full workflow, including where generated quotes go, as the system does not yet have write access to push quotes to AX \[xxiii, xxiv\].

* **UX/AI Engineer Lead Confirmation**: Davis Gallagher inquired about who is leading the UX for this solution, noting that Jigasha is the lead for the demand forecasting project \[xxvii\]. Ray Hsu suggested confirming the UX lead with Utum, who, along with Fugun, can make that decision regarding the AI engineer lead and the UX lead for the Milton cat use cases \[xxvii\].

### Suggested next steps

- [ ] Davis Gallagher will cancel the Topan meeting and schedule Milton for 3 to 4 on Tuesday for a walkthrough demo.  
- [ ] Davis Gallagher will send the success criteria UAT plan to Tim to get his approval to move forward.  
- [ ] Davis Gallagher will confirm the workflow that Tim wants for heat, including the current one and if the new system enables a new one, by shooting a message to him.  
- [ ] Davis Gallagher and Herbert Gomes Miranda will connect later to discuss how to pull through the similarity scoring into the quote generation to update that logic.

*You should review Gemini's notes to make sure they're accurate. [Get tips and learn how Gemini takes notes](https://support.google.com/meet/answer/14754931)*

*Please provide feedback about using Gemini to take notes in a [short survey.](https://google.qualtrics.com/jfe/form/SV_9vK3UZEaIQKKE7A?confid=SIkXXngPBszhmASQQHxfDxIVOAIIigIgABgBCA&detailid=standard)*

# 📖 Transcript

Mar 13, 2026

##  MiltonCAT Services Automation Weekly Sync \- Transcript

### 00:00:00

   
**Davis Gallagher:** Okay, here we go.  
**Herbert Gomes Miranda:** Hello. Heat.  
**Davis Gallagher:** Thanks for uh sending over that uh that documentation is super  
**Herbert Gomes Miranda:** Yeah,  
**Davis Gallagher:** helpful.  
**Herbert Gomes Miranda:** I believe it's better than me like trying to to like translate the words to to explain, you  
**Davis Gallagher:** Yeah, 100%.  
**Herbert Gomes Miranda:** know.  
**Davis Gallagher:** Um hopefully we get Tim on here. I don't know if he's going to join. I know he's super busy and I sent him a text earlier today, but um I have some ideas on uh on what we can do in terms of using the similarity score to pull through the quote because right now I think like you mentioned, we're we're just using the average of all of the work order history um to determine that quote. Um I think I I have some ideas on how we should pull it through. I want to validate them with Tim, but we'll we'll see.  
**Herbert Gomes Miranda:** Okay. Yeah. Uh I believe the uh the price the price the price method calculation changed actually not because of not because of the similarity table but uh I think one of the tasks was about like removing uh records where it had like zero on the prices.  
   
 

### 00:02:28

   
**Herbert Gomes Miranda:** So the the the quote price has changed because the the the average was being  
**Davis Gallagher:** Yeah.  
**Herbert Gomes Miranda:** calculated using these records with zeros. So and now it's not it's not using these records.  
**Davis Gallagher:** Yeah.  
**Herbert Gomes Miranda:** So um the the price changed we are  
**Davis Gallagher:** Yep. Yeah.  
**Herbert Gomes Miranda:** doing we are calculating the average but without the records with zeros.  
**Davis Gallagher:** Yeah, which is good. Which is good. We definitely don't want the zeros to influence that.  
**Herbert Gomes Miranda:** Which which dog do you have? I I remember you told your dog was like eight years old, but uh which breed is  
**Davis Gallagher:** He's a He's a Pushon is the the breed.  
**Herbert Gomes Miranda:** he?  
**Davis Gallagher:** He's like a a a poodle and a bjon uh mix. So, he's this little little tiny dog like this big.  
**Herbert Gomes Miranda:** How do you spell bean? I I've never heard of this before.  
**Davis Gallagher:** Uh, it's B I C H O N.  
**Herbert Gomes Miranda:** Bish F. Oh,  
   
 

### 00:04:24

   
**Davis Gallagher:** Yep.  
**Herbert Gomes Miranda:** it look it looks like a a poodle but smaller.  
**Davis Gallagher:** Yeah. Exactly. So,  
**Herbert Gomes Miranda:** Yeah,  
**Davis Gallagher:** he's a he's a combo combo of that and of a of a  
**Herbert Gomes Miranda:** it's pretty cute.  
**Davis Gallagher:** poodle.  
**Herbert Gomes Miranda:** Yeah. So So pretty.  
**Davis Gallagher:** Yeah, they're funny. They're funny. there. Uh he's a very um what was  
**Herbert Gomes Miranda:** So So they're they're smart, right? They they are smart,  
**Davis Gallagher:** that?  
**Herbert Gomes Miranda:** right? Because of the poodles I think are are  
**Davis Gallagher:** Yeah. Yeah. Um they're very he's pretty smart. The Bejon is definitely more clingy.  
**Herbert Gomes Miranda:** smart.  
**Davis Gallagher:** So he's got like the He's smart like a poodle, but he's very clingy, too. So he loves to like I mean he my mom always cracks me up. Like he literally just follows my mom around everywhere around the house. How's How's your guy doing by the  
   
 

### 00:05:14

   
**Herbert Gomes Miranda:** Yeah.  
**Davis Gallagher:** way?  
**Herbert Gomes Miranda:** that um we did we I took him on it was Sunday night to the vet so he could do an X-ray in the morning uh Monday morning I believe I told this in the in the meeting and the X-ray came came like  
**Davis Gallagher:** there.  
**Herbert Gomes Miranda:** with nothing nothing nothing broken uh but seems like I don't know if you know about this but small breeds Pomeranians speeds German German splits they have a problem called like I believe it's patellar dislocation. I don't know if you know about that.  
**Davis Gallagher:** Yeah, I've heard of it.  
**Herbert Gomes Miranda:** Yeah. But and like he's like he's not crying anymore. He's he doesn't complain about any pain. He's like he's running and suddenly he raises a paw and h starts hopping you know like hop with one paw raised and  
**Davis Gallagher:** Mhm.  
**Herbert Gomes Miranda:** the orthopedist or uh sends send some send some WhatsApp WhatsApp audios saying that he's pretty sure it's uh Patell's location and he's like five months so maybe in theuture He's going to need a a surgery for that.  
   
 

### 00:06:35

   
**Davis Gallagher:** Oh boy. I hope  
**Herbert Gomes Miranda:** Yeah. Yeah. I hope not too.  
**Davis Gallagher:** not.  
**Herbert Gomes Miranda:** But it's pretty common in in for for the Pomeranians.  
**Davis Gallagher:** So interesting.  
**Herbert Gomes Miranda:** I I actually know a Pomeran a white one. Mine is black, but I know a white one. Uh the front rear the rear paws are like instead of being like forward, they are like this.  
**Davis Gallagher:** Uh, it's like Yeah, like a like a duck feet kind of thing,  
**Herbert Gomes Miranda:** Yeah. Yeah. Because uh because of the surgery,  
**Davis Gallagher:** right?  
**Herbert Gomes Miranda:** she walks like with the paws like this, you know. I I think it's painful. I don't know.  
**Davis Gallagher:** Yeah. I mean, I have to imagine at least a little bit, but h that's tough.  
**Herbert Gomes Miranda:** Yeah.  
**Davis Gallagher:** But you said right now he's he's kind of walking around, or is he still hopping a little bit?  
**Herbert Gomes Miranda:** No, he he runs.  
   
 

### 00:07:24

   
**Herbert Gomes Miranda:** He he jumps. But uh and suddenly he he raises a paw.  
**Davis Gallagher:** Yeah,  
**Herbert Gomes Miranda:** It doesn't even doesn't even cry.  
**Davis Gallagher:** just like out of nowhere.  
**Herbert Gomes Miranda:** Doesn't even cry. It's just  
**Davis Gallagher:** So interesting.  
**Herbert Gomes Miranda:** random.  
**Davis Gallagher:** Well, I guess it's good that it's not happening often at least.  
**Herbert Gomes Miranda:** Yeah. Yeah. I don't know what happened. Maybe he's going to dogs. You know, I have we have to spend a lot of money, man.  
**Davis Gallagher:** Oh yeah, they ain't  
**Herbert Gomes Miranda:** They ain't cheap.  
**Davis Gallagher:** cheap.  
**Herbert Gomes Miranda:** I spent more with because medicine in the United States is pretty expensive, I know, but to be honest,  
**Davis Gallagher:** Oh  
**Herbert Gomes Miranda:** I spent more money with his health than with mine in the last five years.  
**Davis Gallagher:** yeah,  
**Herbert Gomes Miranda:** You know,  
**Davis Gallagher:** dude.  
**Herbert Gomes Miranda:** he took more vaccines than  
**Davis Gallagher:** The Oh, yeah.  
**Herbert Gomes Miranda:** me.  
**Davis Gallagher:** Oh, yeah.  
   
 

### 00:08:15

   
**Davis Gallagher:** My mom was saying I think yeah the little one we have just had like a a bladder stone or a yes a stone. Um and it was like a thousand bucks to go to the vet and get rid of a stone. She was like what the what the hell? I don't have a thousand bucks lying  
**Herbert Gomes Miranda:** Yeah. Like if I feel any pain,  
**Davis Gallagher:** around.  
**Herbert Gomes Miranda:** I just go to sleep and hope it get I get better tomorrow, you know. But I can't that with the dog.  
**Davis Gallagher:** No. No dog has pain. They're going to the doctor right  
**Herbert Gomes Miranda:** Yeah. I just sleep,  
**Davis Gallagher:** away.  
**Herbert Gomes Miranda:** you know, drink some water, sleep, and hope get better  
**Davis Gallagher:** Literally, dude,  
**Herbert Gomes Miranda:** tomorrow.  
**Davis Gallagher:** it's too funny. It's a nice headset you got there, too. Is that um Yeah,  
**Herbert Gomes Miranda:** It's a Corsair Vosu. It's a Corsair Vu.  
**Davis Gallagher:** I thought I thought it was Corsair.  
   
 

### 00:09:07

   
**Herbert Gomes Miranda:** Yeah, it's a Vu carbon.  
**Davis Gallagher:** I've got I've got a I had a Corsair mouse.  
**Herbert Gomes Miranda:** The Yeah,  
**Davis Gallagher:** So, I've never had their headsets.  
**Herbert Gomes Miranda:** it's pretty good.  
**Davis Gallagher:** So,  
**Herbert Gomes Miranda:** It's pretty expensive. Uh I don't know the price in United States, but uh in AI it's around 300 bucks.  
**Davis Gallagher:** Oh man.  
**Herbert Gomes Miranda:** I don't know the the price there,  
**Davis Gallagher:** Okay.  
**Herbert Gomes Miranda:** but uh it's a pretty expensive uh headset here in Brazil because the the the average like 400 he eyes. That's like 80 bucks. So it's but but it's worth it because these pads here uh I have this headset for five years.  
**Davis Gallagher:** Oh wow.  
**Herbert Gomes Miranda:** Yeah. And in Brazil,  
**Davis Gallagher:** Okay.  
**Herbert Gomes Miranda:** in the United States, you can buy these pads easily because you have the the Corsair um uh customers like they they they you can buy this for like 10 bucks, the pads here, but in Brazil, they don't sell it. So, I believe for three times I sent a message to Corsair saying, "Guys, I know I don't have the warranty anymore. I want to buy it.  
   
 

### 00:10:13

   
**Herbert Gomes Miranda:** you you don't have to send me for free. I went to buy it. Send me the link so I can buy it and they send me four times  
**Davis Gallagher:** Yeah.  
**Herbert Gomes Miranda:** the these pads. So I have a lot of like old pads here that are like like this, you know.  
**Davis Gallagher:** Worn out. Yeah.  
**Herbert Gomes Miranda:** Yeah. So they send me four times for free. Even the microphone it was like um I was like taking off my t-shirt and I broke this. It's not their fault,  
**Davis Gallagher:** Yeah.  
**Herbert Gomes Miranda:** you know. I shouldn't I said, "Guys, I know it's not fault of the Corsair. It was me that broke the the microphone." Uh, I went to buy a new one and they said just like, "Send me your address." And they sent me a a new microphone  
**Davis Gallagher:** That's sweet. Damn,  
**Herbert Gomes Miranda:** for Yeah,  
**Davis Gallagher:** that's some good customer support right  
**Herbert Gomes Miranda:** very good.  
   
 

### 00:11:00

   
**Davis Gallagher:** there.  
**Herbert Gomes Miranda:** The the old microphone is this this one here. So, this one is better than than this one, actually.  
**Davis Gallagher:** I was going to say that microphone is really nice,  
**Herbert Gomes Miranda:** Yeah.  
**Davis Gallagher:** man.  
**Herbert Gomes Miranda:** And it like when I mute here, I'm going I believe I'm using the the MacBook uh microphone, but uh but but I should be using the head. Yeah, now I'm using the headset microphone.  
**Davis Gallagher:** Oh, sweet. Yeah. Yeah, I might need to get one of those. I've got a Yeah,  
**Herbert Gomes Miranda:** Yeah, the customer support is very good.  
**Davis Gallagher:** I've got I've gotten this thing I've had laying around for I don't know. I've had these for these are like 30 bucks. I've just the last I don't know how many years. The the microphone is horrific. Like I sound like I'm in a tin can, but it does the job.  
**Herbert Gomes Miranda:** But but to be honest, I feel I feel that uh I don't fit the meetings because I'm all the meetings I join, I'm the only one using headsets.  
   
 

### 00:12:03

   
**Herbert Gomes Miranda:** Everyone is using AirPods or like using using the like the laptop speaker. No one no one uses headset. I don't know  
**Davis Gallagher:** Yeah, AirPods are a big thing.  
**Herbert Gomes Miranda:** why.  
**Davis Gallagher:** I don't like using AirPods because I find that sometimes like it's very hit or miss. Sometimes AirPods have a really good mic and sometimes the mic is really bad and I don't know what I'm going to get depending on the day. So,  
**Herbert Gomes Miranda:** Mhm.  
**Davis Gallagher:** I try not to use them as much as I can.  
**Herbert Gomes Miranda:** So you use like just the speakers and the the MacBook.  
**Davis Gallagher:** Yeah. Yeah. I I have a Windows laptop actually,  
**Herbert Gomes Miranda:** Oh,  
**Davis Gallagher:** but yeah,  
**Herbert Gomes Miranda:** Windows.  
**Davis Gallagher:** because I I used Windows at my old job and I'm so used I I didn't know that we were a Google Sheets or a Google Suite. So, I was so used to like all the Excel hotkeys and like the Windows keys and like snapping windows back and forth that I was like, I'm just going to stick with it.  
   
 

### 00:12:45

   
**Davis Gallagher:** But then we ended up using Google for everything. So, it didn't even matter. I should have just gotten a Mac.  
**Herbert Gomes Miranda:** Yeah. But do do you rather using Windows than Mac?  
**Davis Gallagher:** No, I like a Mac. I have a Mac for my personal,  
**Herbert Gomes Miranda:** Yeah.  
**Davis Gallagher:** but like I was just so used to it for work that I was like,  
**Herbert Gomes Miranda:** Oh,  
**Davis Gallagher:** "Oh." Of course, didn't even matter.  
**Herbert Gomes Miranda:** I have a I like Windows better. I have my personal computer, my like gaming computer is is Windows because I I play with my play with my friends. So Mac is not like built for that. Uh but yeah,  
**Davis Gallagher:** Yeah.  
**Herbert Gomes Miranda:** I believe for work for like productivity Mac is is is better than Windows I I believe.  
**Davis Gallagher:** Yeah. Did you Did you build your own PC or you have a pre-built?  
**Herbert Gomes Miranda:** No, I bu I bought it and I built it.  
   
 

### 00:13:28

   
**Davis Gallagher:** Oh, sweet. Okay.  
**Herbert Gomes Miranda:** Yeah.  
**Davis Gallagher:** I built I built one with my brother I don't know 10 years ago now. We had like Yeah, we had I think we got him an i7. This is back in like the 10 if it was 1040\.  
**Herbert Gomes Miranda:** Well,  
**Davis Gallagher:** Maybe a 1050 was like a big was the big car on the market. So, I think he's got a 1040 Ti or a 1050 or something like that. Dude, it was it was so much  
**Herbert Gomes Miranda:** yeah. So,  
**Davis Gallagher:** fun.  
**Herbert Gomes Miranda:** I it was probably like the third generation of the i7, right? Third or second generation?  
**Davis Gallagher:** I think it was I think it was a fourth  
**Herbert Gomes Miranda:** Fourth gen. Yes. Okay.  
**Davis Gallagher:** gen.  
**Herbert Gomes Miranda:** Sometimes I forget we are in 2026\.  
**Davis Gallagher:** Yeah. What What generation? Oh, there were It's not 14, right? We're past 14\.  
**Herbert Gomes Miranda:** Let me  
   
 

### 00:14:09

   
**Davis Gallagher:** I feel like even the 14 like 14s were a few years ago now at this point.  
**Herbert Gomes Miranda:** see.  
**Davis Gallagher:** I'm also so out of date. Like it's crazy too because Intel was the king back in the day and then Ryzen took over and it's  
**Herbert Gomes Miranda:** Yeah,  
**Davis Gallagher:** like Damn.  
**Herbert Gomes Miranda:** we are we are in the 14th.  
**Davis Gallagher:** Okay. All right. I had that.  
**Herbert Gomes Miranda:** I I I looked it here  
**Davis Gallagher:** Do you have a you have an Intel or uh AMD in there?  
**Herbert Gomes Miranda:** AMD. AMD, but mine is pretty old actually.  
**Davis Gallagher:** Yeah.  
**Herbert Gomes Miranda:** The problem is that uh I don't know what happened to the prices there in the US, but uh I bought my PC on like the peak of the pandemic.  
**Davis Gallagher:** Oh  
**Herbert Gomes Miranda:** So everything was like so expensive. Uh I I spent like 12 13,000 he eyes.  
**Davis Gallagher:** yeah.  
**Herbert Gomes Miranda:** That's almost like two and a half thousand dollars. And yeah, it's expensive.  
   
 

### 00:15:00

   
**Herbert Gomes Miranda:** And the the my like the parts of the PC are not the best, you know, like my I I paid $1,000 for my graphics card. So it's like 5,000 he eyes. And after the pandemic,  
**Davis Gallagher:** Yeah.  
**Herbert Gomes Miranda:** the price of this graphics card is like a thousand he eyes. So like  
**Davis Gallagher:** Yeah, dude.  
**Herbert Gomes Miranda:** $200  
**Davis Gallagher:** The the prices during the pandemic were absurd. The the crazy thing though is like the RAM prices went nuts earlier this year and last year.  
**Herbert Gomes Miranda:** right  
**Davis Gallagher:** Like I remember I mean was it uh is it it's not Heinix.  
**Herbert Gomes Miranda:** now.  
**Davis Gallagher:** It's uh what was the company that isn't even doing consumer RAM anymore? Yes.  
**Herbert Gomes Miranda:** Samsung Samsung stopped producing RAM. They are only saying selling to like any video to to build like AI graphics  
**Davis Gallagher:** Yeah, and that's crucial.  
**Herbert Gomes Miranda:** card.  
**Davis Gallagher:** Micron, they're not Micron is no longer doing consumer RAM anymore  
**Herbert Gomes Miranda:** Yeah.  
   
 

### 00:15:56

   
**Herbert Gomes Miranda:** Yeah.  
**Davis Gallagher:** either.  
**Herbert Gomes Miranda:** I believe they are like the two biggest uh manufacturers. I believe it's Samsung and and and Micron that they build the chips the the chips for the  
**Davis Gallagher:** Yep. Yep.  
**Herbert Gomes Miranda:** uh  
**Davis Gallagher:** Yeah. No, probably not great for for RAM  
**Herbert Gomes Miranda:** Yeah, but to be honest, I I I didn't for me I didn't felt it was like too expensive because I don't know if you  
**Davis Gallagher:** prices.  
**Herbert Gomes Miranda:** remember or did you make part of it but uh in the pandemic we had a lot of like Ponzi schemes uh crypto Ponzi schemes like crypto games I don't know if you see you know like bomb crypto and like uh these crypto games you know where you could make  
**Davis Gallagher:** Yeah, I've heard of some of them.  
**Herbert Gomes Miranda:** money.  
**Davis Gallagher:** I I was Yeah, I was kind of I I knew all about the the the bubble the like the the  
**Herbert Gomes Miranda:** Yeah, we had some bubble.  
**Davis Gallagher:** million the $2 million board ape  
   
 

### 00:16:50

   
**Herbert Gomes Miranda:** Yes.  
**Davis Gallagher:** NFTts.  
**Herbert Gomes Miranda:** Yes. Yes. Now they are worth nothing, you know. Uh and this at this time all I had was $3,000 like 15 15,000 he eyes. That was like two years of work because I was an intern at Mars. So that that was all I had. And I said, well, or I'm going to make a lot of money or I'm going to lose everything here. So I bought like I bought some crypto like NFTts in in those games and I was making almost $1,000 a day.  
**Davis Gallagher:** Holy s\*\*\*. Jesus  
**Herbert Gomes Miranda:** Almost $1,000 a day.  
**Davis Gallagher:** Christ.  
**Herbert Gomes Miranda:** it for for less than one month. But yeah,  
**Davis Gallagher:** Not Not bad though.  
**Herbert Gomes Miranda:** not bad.  
**Davis Gallagher:** Not bad at all.  
**Herbert Gomes Miranda:** Yeah, not bad. I Yeah, I I've begun with like $3,000 and I make I believe like 20 $25,000.  
**Davis Gallagher:** Holy s\*\*\*, dude.  
**Herbert Gomes Miranda:** Yeah.  
   
 

### 00:17:51

   
**Herbert Gomes Miranda:** So,  
**Davis Gallagher:** Nice ROI  
**Herbert Gomes Miranda:** like I bought I Yeah. Like I bought I bought this PC.  
**Davis Gallagher:** there.  
**Herbert Gomes Miranda:** I bought uh my grandparents a a nice TV. So, Yeah.  
**Davis Gallagher:** That's f\*\*\*\*\*\* awesome, dude. That's sick. I didn't I uh I only made a few thousand. I was a little I was a little soft.  
**Herbert Gomes Miranda:** Yeah.  
**Davis Gallagher:** I was a little like hesitant. So, I made a lot on the the Ethereum run when Ethereum went from like what was it? I don't know 500 or a,000 to like 4,000. But after that, like not much.  
**Herbert Gomes Miranda:** But do you still buy it?  
**Davis Gallagher:** No, no,  
**Herbert Gomes Miranda:** Ah, me me neither.  
**Davis Gallagher:** not even.  
**Herbert Gomes Miranda:** I I lost a lot of money with Bitcoin, so I I don't buy it anymore.  
**Davis Gallagher:** Oh, man. Hey, Ray.  
**Ray Hsu:** Hey, are we still waiting for the customer?  
**Davis Gallagher:** Yeah, I texted Tim twice. I have not heard back.  
   
 

### 00:18:35

   
**Davis Gallagher:** Um,  
**Herbert Gomes Miranda:** Anyway,  
**Davis Gallagher:** I texted him this morning.  
**Ray Hsu:** Oh,  
**Davis Gallagher:** I texted him 10 minutes into the meeting and I texted him five minutes ago and I haven't heard.  
**Ray Hsu:** shoot.  
**Davis Gallagher:** So,  
**Ray Hsu:** Okay.  
**Davis Gallagher:** I'm gonna assume that we're going to cancel this one. Um, but I think that's all right. Um, good thing is we've we've got some good work done. Herbert um was able to join the Tim finally provided the parts data um to us on Wednesday. So, Herbert was able to join that table with the work order history table and create the similarity score based on the framework that Luke had developed. Um and our our kind of next steps are um right now the similarity score isn't being used to inform the quote price. Um we're going to kind of start using that to inform what the quote generated is. So that's our next steps is essentially um taking the similarity score as an input to what the quote is instead of the quote just being an average of prior work histories or work orders.  
   
 

### 00:19:24

   
**Ray Hsu:** Mhm.  
**Davis Gallagher:** Um and then the other things that we'll have to do is two other items as part of the road map. Uh, I I created a sex a success criteria UAT plan. Tim just texted me actually. Yep. Okay, we're gonna cancel. Um, Tim just uh So, going back to what I was saying, um, we're going to pull the similarity screw similarity score into the quote generation. So, that'll be good.  
**Ray Hsu:** Yeah.  
**Davis Gallagher:** We're going to update the analytics on the right hand side based on some of Tim's feedback. And we're also going to update the mobile UI. And that should be um that should cover us. And then I'm going to send the the plan out to Tim, get his thumbs up, and hopefully we can get  
**Ray Hsu:** Awesome.  
**Davis Gallagher:** going.  
**Ray Hsu:** Have um I haven't been able to had a chance to see what the UI looks like.  
**Davis Gallagher:** Yeah,  
**Ray Hsu:** Is it?  
**Davis Gallagher:** let me  
**Ray Hsu:** We don't have to go in detail, but I'd love to just kind of take a quick  
   
 

### 00:20:17

   
**Davis Gallagher:** Yeah, I'll pull it up now.  
**Ray Hsu:** look.  
**Davis Gallagher:** So this is the this is the desktop UI. This is the one we've been working in primarily so far. Same sort of flow.  
**Ray Hsu:** Mhm.  
**Davis Gallagher:** You pick pick your machine model. Um pick your prefix  
**Ray Hsu:** Job code.  
**Davis Gallagher:** sorry job code and then your component code.  
**Ray Hsu:** Okay.  
**Davis Gallagher:** Generate a quote based on that. So this one we have a standard job is it'll show you directly the standard job which we'll use for the quote. Uh what Tim requested on the right hand side these figures they know pretty well. So they know the top models, they know the top job codes, they know the top component codes. So what he asked for was rather than these type of statistics,  
**Ray Hsu:** Mhm.  
**Davis Gallagher:** if instead we could essentially have on the right side a reflexive uh platform that shows um let me let me pull up exactly what he mentioned.  
**Ray Hsu:** Is this real data?  
**Davis Gallagher:** This is real data.  
   
 

### 00:21:44

   
**Ray Hsu:** Wow. And we because I remember generating this with Claude,  
**Davis Gallagher:** Yeah.  
**Ray Hsu:** but uh it looks similar, but it's probably much better now.  
**Davis Gallagher:** Yeah.  
**Ray Hsu:** Cool.  
**Davis Gallagher:** I think the back end has been has been enhanced a lot. Um, essentially what Tim wants to see is when we on this lefth hand side generate a service quote for a particular combination, he wants us to provide some analytics around how many times different types of combinations have been used. So for example 14E72G 014 how many times has that combination been used as a work order this fourletter combination this four string combination how many work orders have we performed for that so that when he or when somebody is putting in these quotes if we see oh we've generated 50 work orders for this before why don't we make it a standard job that's the type of have on the right hand  
**Ray Hsu:** I see. I  
**Davis Gallagher:** side and so that'll be the change that we make over the course of next week uh  
**Ray Hsu:** see.  
   
 

### 00:22:40

   
**Davis Gallagher:** and this is the the mobile app the Only thing I think this is actually a pretty pretty useful mobile app. The only thing we need to do here is um right now on the desktop version we have machine model, serial prefix, job code and component code. We don't have the serial prefix on the the mobile front end. So we need to include that toggle as  
**Ray Hsu:** I see that this is just to generate the quote.  
**Davis Gallagher:** well.  
**Ray Hsu:** I I think the mobile app is where most the time they generate the code the quote and then on the desktop app is when they actually approve it. Is that  
**Davis Gallagher:** I don't know if we have that flow fully confirmed yet.  
**Ray Hsu:** um okay?  
**Davis Gallagher:** Um because right now we we don't have this pushing to AX  
**Ray Hsu:** Okay.  
**Davis Gallagher:** piece. Um you know, we won't have that until we have right access.  
**Ray Hsu:** Yeah.  
**Davis Gallagher:** So the the generation of the quote and where it where it goes to is is still an open question for  
   
 

### 00:23:27

   
**Ray Hsu:** Yeah.  
**Davis Gallagher:** me.  
**Ray Hsu:** Okay. Yeah. I think maybe just confirm I think when I talked with Tim earlier like on the desktop is when somebody can come in and say, "Oh, here are all the quotes that people have generated out in the field. Let me review it and then push it push it into AX or talk to But yeah, let's confirm that workflow. And then yeah, the the question is like even on the mobile app, if I'm generating a bunch of quotes, where do they go? Right? Are they am I able to go back and look at all the quotes I generated and all that  
**Davis Gallagher:** Yeah,  
**Ray Hsu:** stuff?  
**Davis Gallagher:** got it. Tim also just texted me. He said he wants to do a demo. We'll invite VP. That was that was all I got.  
**Ray Hsu:** That's fantastic. That's good. We'll we'll need to get some feedback. But yeah, let's confirm the workflow that they want for heat this um both the current one and then if there's a this enables a new one.  
   
 

### 00:24:29

   
**Davis Gallagher:** Okay, got it. Yep. I'll shoot that a message to  
**Ray Hsu:** Awesome. This looks great.  
**Davis Gallagher:** him.  
**Ray Hsu:** And what type of what type of um are we doing some kind of machine learning as well that we'd say, hey, here here's where we think there should be like a a standard job  
**Davis Gallagher:** Not yet. That's kind of what Tim was alluding to on this right hand side is like when I put in a combo,  
**Ray Hsu:** created.  
**Davis Gallagher:** I want to see how many times we've generated a quote or how many work orders we have so I can determine where we should generate standard jobs. But we're not doing any advanced level analytics on that right  
**Ray Hsu:** Oh, okay. He wants to do it. Yeah.  
**Davis Gallagher:** now.  
**Ray Hsu:** I think my I think one of the things we talked about is that the system would would look for potential like candidates for standard jobs.  
**Davis Gallagher:** Okay.  
**Ray Hsu:** But but um yeah, we we don't we we can bring that up or we can we can do what this that I guess at some point he looks at this he wants to create a new standard job somewhere.  
   
 

### 00:25:27

   
**Davis Gallagher:** Okay, got it.  
**Ray Hsu:** And where do we get where do we get the standard jobs?  
**Davis Gallagher:** Um,  
**Ray Hsu:** This isn't a separate separate it's in the spreadsheet.  
**Herbert Gomes Miranda:** Yep, it's in a separate  
**Ray Hsu:** Yeah. Yeah.  
**Davis Gallagher:** yep.  
**Ray Hsu:** Okay.  
**Herbert Gomes Miranda:** file.  
**Davis Gallagher:** Um, so we do have the Topan meeting at 3\.  
**Ray Hsu:** Cool.  
**Davis Gallagher:** Should I, since we'll be on site with them, should I cancel that and then schedule Milton for 3 to 4 on Tuesday?  
**Ray Hsu:** Uh on Tuesday.  
**Davis Gallagher:** Yes.  
**Ray Hsu:** Sure. Uh,  
**Davis Gallagher:** Okay.  
**Ray Hsu:** and you're not talking about right now. 3 o'clock right now.  
**Davis Gallagher:** No, three o'clock on.  
**Ray Hsu:** Okay.  
**Davis Gallagher:** He wants to meet from 3 to 4 next week,  
**Ray Hsu:** Yeah.  
**Davis Gallagher:** I think, to essentially go through a walkthrough demo of  
**Ray Hsu:** Yeah. Yeah.  
**Davis Gallagher:** this.  
**Ray Hsu:** We since we're going to actually be like there on Thursday. So, yeah, we can move that.  
**Davis Gallagher:** Okay, cool.  
**Ray Hsu:** Cool.  
   
 

### 00:26:20

   
**Davis Gallagher:** All right. Well, I think we're good then. Um Herbert, uh I'll probably um connect with you a little bit later. I got a call from 3 to 350, but after that I'll kind of provide some thoughts on how we can pull through the similarity scoring into the the quote generation so we can update that logic. And then there's a a few UI enhancements. I guess Ray, maybe there's a question for you in terms of like UI and and making updates to the UI. Is are we okay to assume that Jigasha is kind of running point for multiple these multiple Milton cat use cases from a UX perspective?  
**Ray Hsu:** um not sure like um how that process works, but I would uh I would just confirm with um with UTM. My my guess is yes. But yeah,  
**Davis Gallagher:** Okay.  
**Ray Hsu:** it's not a like I don't know how to make that call.  
**Davis Gallagher:** Okay. Got it. Yeah. Because I'm just a bit um unclear on,  
**Ray Hsu:** Yeah.  
**Davis Gallagher:** you know, h who I guess is focusing on the UX for this solution. I know Jig is on the demand forecasting one, but it would be helpful to know that so that when there's a UX change that needs to be made, I have a person to to run it by.  
**Ray Hsu:** Yeah, you can you can work through UTM. And I guess who's the lead AI engineer on this? Like Fuga?  
   
 

### Transcription ended after 00:28:00

*This editable transcript was computer generated and might contain errors. People can also change the text after it was created.*