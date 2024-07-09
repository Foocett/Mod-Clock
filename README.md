
# Holland Hall '24 Modular Clock
This project was created by Andrew Fawcett on behalf of the Holland Hall class of 2024    

 - You can contact me at ajfawcett@gmail.com   
 - [My GitHub](https://github.com/foocett)
 - [GitHub Repository](https://github.com/foocett/mod-clock)
 - [Class of 2024 Instagram](https://www.instagram.com/hhdutch24?igsh=bTNlNGsxYjdndnlx)

# Table of Contents
- [Overview](#Overview)
- [Software](#Software)
  - [Client Side (HTML/CSS)](#client-side-htmlcss)
  - [Client Side (JavaScript)](#client-side-js)
  - [Server Side](#server-side)
- [Hardware](#Hardware)
  - [Hardware List](#hardware-list)
  - [Raspberry Pi Configuration](#raspberry-pi-configuration)
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
  Learning and getting the hang of CSS just generally sucks and I can't fully explain it here, but more details can be found
  in the [resources](#resources) section.

### Client Side (JS)
**Prerequisites:** 
  - Intermediate understanding of Javascript (json format, arrow notation, DOM)
  - Familiarity with the Socket.io package (see resources)
  - General understanding of HTML and CSS, and how we can manipulate them

### Server Side
**Prerequisites:** 
  - Decently advanced understanding of JavaScript
  - The ability to effectively read general package code documentation
  - Read docs for all the packages found in [package.json](package.json) (see resources)



# Hardware

### Hardware List

### Raspberry Pi Configuration
**Prerequisites:**
  - Basic command line/terminal
  - Be familiar with git (see resources)
  - Know generally how a webapp like this works and is structured


# Resources

### General Resources

### Javascript/HTML/CSS

### Node/NPM

### git

### Shell/Scripts

### Libraries

### Other


# Final Words