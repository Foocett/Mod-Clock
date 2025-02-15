
# Holland Hall '24 Modular Clock
This project was created by Andrew Fawcett('24) on behalf of the Holland Hall class of 2024    

 - You can contact me at ajfawcett@gmail.com   
 - [My GitHub Profile](https://github.com/foocett)
 - [Code Repository](https://github.com/foocett/mod-clock)


# Table of Contents
- [Overview](#Overview)
- [Setup]
- [Software](#Software)
  - [Client Side (HTML/CSS)](#client-side-htmlcss)
  - [Client Side (JavaScript)](#client-side-js)
  - [Server Side](#server-side)
- [Resources](#Resources)
  - [General Resources](#general-resources)
  - [Javascript/HTML/CSS](#javascripthtmlcss)
  - [Node/NPM](#nodenpm)
  - [git](#git)
  - [Shell/Scripts](#shellscripts)
  - [Libraries](#libraries)
  - [Other](#other)
- [Final Words](#Final-Words)

# Overview
This is a clock designed to graphically display Holland Hall's six-day 18-mod schedule.
It consists of three main pages; the clock (/clock), the configuration page (/config), 
and the admin page (/admin), plus two login pages for config and admin.
I have intentionally added very detailed documentation to most aspects of this project, and 
will keep it open source for future students or classes to learn from and/or modify, especially 
in the case that our schedule changes in some way

The clock is locally hosted on a Raspberry Pi 5 running Pi OS, a lightweight
debian-based operating system built for the raspberry pi. A more detailed list of all the 
hardware can be found in the [hardware](#hardware) section of this document.

The software for this project is a Node.js app that primarily uses the Socket.io and Express.js 
libraries/framework. A full list of all packages used and links to their documentation can be 
found in the [resources](#resources) section, and a more specific description about how each 
package is used and why can be found in the [software](#software) section.

I have left educational and referential resources that can be found in the [resources](#resources) 
section, while some of these resources are general, the majority of them are in reference to 
specific section(s) of code, which will all will contain a comment like this: `//more information about this can be found in the readme file`

Some sections of this document are going to be much more complex than others.
For example, the section covering the server side of the project contains detailed documentation
about how the software works, and assumes you are already familiar with a lot of concepts.
On the other hand, the sections covering HTML and CSS are very introductory summaries of what visual frontend is, 
as there isn't a whole lot to document. Because of this, each subsection will list a general complexity level, and a
list of prerequisite concepts that you will need to be familiar with to fully understand it. A lot of stuff in here is stuff
that HH doesn't teach (as of when I graduated) that I had to teach myself, so there's no shame in not knowing it.
That being said, most of your teachers are huge nerds and would be more than happy to explain concepts to you if you wish to learn more
about this project or programming as a whole.

# Setup
  The setup for the clock is pretty simple but I feel like it's a good idea to generally lay out how to do some key tasks.

  1) As soon as you get the clock make sure to connect it to the internet, keep in mind the raspberry pi the clock runs on is using a very user-oriented version of linux so connecting to the internet shouldn't be too much of an issue. Really all you need to do is close the clock page (see next tip) then click the wifi symbol in the top right and continue as you would with any other device.
  2) By default the clock is in kiosk mode, making any meaningful interaction with the computer pretty difficult; to close the page, use Alt+F4 on the provided keyboard. Note that the easiest way to re-open the clock is to just 
  3) To update the software, you just need to reboot the computer, the safest way to do this is by opening the terminal app found in the top left after closing the clock page then run `sudo shutdown -r now`, this should reboot the computer and the clock page should be back up and displaying updated content within 30-ish seconds
  4) Shutting the clock down is pretty much identical to updating/rebooting it, just follow the same instructions but omit the restart flag in the command, giving us `sudo shutdown now`. After this the clock should be powered off, after five or ten seconds you are safe to unplug the power
  5) Accessing the hardware is pretty simple, after un-mounting the clock from the wall, unscrew the four philips head screws in the back of the clock then use a finger nail or the screw driver to pry up the back lid. Frankly I don't know why you'd have to do this but that's how you do it
  6) To change the admin login, go to the [config](settings.json) file and change the adminPassword paramater
  7) The admin page is actually just a page to control who is able to access the clock settings, at the moment this is only letter day and theme but still things we want to control access of. To change this, go to the IP address listed on the clock, followed by `/admin`, in general this will most likely look similar to `192.168.84.52:3000/admin`. Once on this page, you can add and remove registered users, make sure to remove the default user before production.
  8) To change the theme and letter day, first make sure you have been registered through the admin page, then navigate to the IP listed on the clock followed by `/config` and login, from this page you can control the letter day and theme through the two dropdown menus

# Software

### Client Side (HTML/CSS)

  **Prerequisites:**  
    - Just look at the HTML and CSS in this project, take it in, just kinda know what it looks like
  
  When learning web design, HTML and CSS are the first two things you are going to learn, often at the same time. 
  These two languages act to tell the browser how the webpage should look. It's important to note that while they are languages, they are not 
  *programming* languages per se, as they both lack any kind of logic or computational abilities.   
  
  **So what is HTML?**

  HTML or Hyper Text Markup Language, serves as the skeleton for every website, it's how your browser knows **what** is on the page.
  Without HTML your website just wouldn't exist, in other words, is where all of your website's objects and components are kept.    
  More detailed resources about HTML and its notation can be found in the [resources](#resources) section.   
  
  **Okay, so now what is CSS?**

  CSS, or cascading style sheet, is a language used to 'style' our site, or in other words, change how it looks. Similarly to JavaScript, 
  it can be written inside of the HTML file, using the style object (`<style></style>`), however it's common for it to be written inside 
  its own dedicated file, with the extension .css. When done this way, we can need to connect or 'link' it into our HTML file
  using the `<link>` object.  
  This example of a CSS file being linked to an HTML file can be found in the [clock.html](Public/clock.html) file.   
  `<link rel="stylesheet" href="clock.css">`    
  In this we are creating a link object, specifying that it is a stylesheet, and providing the file we want to link.  
  Note the lack of a `</link>` in the link object. While most HTML objects require an opening tag `<obj>` as well as a closing
  tag denoted by a `/` at the beginning `</obj>`, There a a few objects like this that do not require a closer. another example is the `<img>` object.    
  Full disclosure, learning and getting the hang of HTML/CSS generally sucks and the only real way to improve is by doing it, but it's rewarding and kinda fun once you get it. 
  
  Once again, more detailed documentation can be found in the [resources](#resources) section.

### Client Side (JS)
#### Prerequisites:
  - Intermediate understanding of Javascript (json format, arrow notation, DOM)
  - Familiarity with the Socket.io package (see resources)
  - General understanding of HTML and CSS, and how we can manipulate them


**startTime()**
  - Return Type: void
  - Parameters: none
  - This function is the main driving function for the clock, serving as a sort of init function

### Server Side
**Prerequisites:** 
  - Decently advanced understanding of JavaScript
  - The ability to effectively read general package code documentation
  - Read docs for all the packages found in [package.json](package.json) (see resources)

# Resources

### General Resources

### Javascript/HTML/CSS

### Node/NPM

### git

### Shell/Scripts

### Libraries

### Other


# Final Words