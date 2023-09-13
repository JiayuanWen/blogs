# Dynamic Content For GitHub Pages


**Published Date:** 08/30/2023

**Last Edited:** 09/06/2023
<br>
<br>
<br>
<br>

GitHub Pages is a static site hosting service that uses resources (HTML, CSS, and JavaScript) from GitHub repository to build a public website. It is suitable for hosting a personal website for showcasing your projects, posting blogs, and share documentations and other resources, all free of charge.  

One major drawback of GitHub Pages is that it only support static site, which means it does not support access to databases nor datastores. Therefore, if you have a long list of contents or content links to display, or want to implement any form of dynamic contents (such as a list of videos, news article shortcuts, or list of projects), you will have to store the contents in your site's repository, which can result in very cluttered codebase, making modifications and maintenance difficult down the line. 

There is a workaround to this drawback, that is to use a separate repository as your site's database/datastore, which involves storing the lists of contents in a separate repository, then access them from within the GitHub Page site using jQuery. Not only does this help de-clutter your site's codebase, it also allows addition, removal, and modification to the contents without re-deploying your site. In this tutorial, I will show you the how of this method.

This tutorial assumes you already have basic knowledge on creating a website and using Git, so a lot of steps regarding those will be skipped over. 

<sup ><font style="color: #ff9999">Note: This method of storing and organizing contents is not private. You do NOT use this method for operations involving sensitive information (such as handling of user accounts), since the contents of the repository can be easily viewed by anyone.</font></sup>

## Step 1. Create a GitHub Pages repository

Create a GitHub Pages site as normal following this [official guide](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site). If you already have a GitHub Pages site running, you can skip to step 2. 

## Step 2. Create another repository for your contents

Next step is to create a separate repository for hosting your contents. I will call this repository the *content repository* from now on. 

<img src="https://raw.githubusercontent.com/JiayuanWen/blogs/main/resources/blog1/newRepo.png"/>

Name it something similar to your GitHub Pages site repository so that it is easier to find. Your site repository is named `<username>.github.io`, then you can name it `<username>.github.io.contents` (Replace `<username>` with your GitHub username or organization name).   

You have to set this repository to public for the contents inside to be accessable, so do not store sensitive information or source codes in here. This tutorial will assume you have your content repository set to public.



## Step 3. Put your contents in

You can now put the contents you want to display on your GitHub Pages site into the content repository. 

For storing a list of contents of the same characteristics (For example: A list of article shortcuts, each has a thumbnail and a short description), give a common name for each, followed by an index.
```file_structure
<username>.github.io.contents/
└── contents/
    ├── content1/
	    ├── thumbnail.png
	    └── display.html
    ├── content2/
    ├── content3/
    ├── content4/
    ├── content5/
    ├── content6/
    └── content7/
```

`display.html` contains the HTML code that will be inserted to your site to be displayed. For above example, reference this code template (ignore the `<img>` element for now, we will talk about it right after):
```html
<div class="content">
    <a target="_blank" href="link/to/your/destination">
      <img src="https://raw.githubusercontent.com/<username>/<username>.github.io.contents/<main-branch-name>/contents/content<index>/thumb.png">
    </a>
    <div class="desc">A short description for this content</div>
  </div>
```

Notice `src` for the `<img>` element, if you have any associated resources (videos, images, audios, etc) to be included, you have to imagine the repository file path to said resources when you push them into your content repository. For our article with thumbnail example, start with the local path to thumbnail relative (with your content repository as root):
```html
<img src="/contents/content<index>/thumb.png"/>
```
Replace `<index>` in `content<index>` with the index number corresponding to the content folder the `display.html`  resides in. So for `display.html` in `content1` you replace it with `1`, and so on. 

Next, append this to the end of your file path:
```
https://raw.githubusercontent.com/<username>/<username>.github.io.contents/<name_of_main_branch>
```
Replace `<username>` as stated earlier. Your content repository will likely have a different name for its main branch, in most cases it is either `main` or `master`, change `<name_of_main_branch>` accordingly. 

The final path should look like this:
```html
<img src="https://raw.githubusercontent.com/<username>/<username>.github.io.contents/<name_of_main_branch>/contents/content<index>/thumb.png"/>
```
Change `content<index>` the same way as instructed earlier. 

The reason we're doing this is because if we link the resources locally, the resources will not display when displayed on our site, since the resources don't exist in our GitHub Pages site's repository, only in our content repository.

Push everything when you are done.

## Step 5. Insert your contents into your site

Now that you have everything stored in your content repository, it is time to access it from your site using JavaScript and jQuery. Shift your attention to your site's repository.

First thing to do is get jQuery ready. You can download the latest version of *jquery.min.js* from their [official website](https://jquery.com/download/), save it somewhere in your site's repository. Then, include the file in your `<head>` element:
```html
<head>
	...
	<script src="/path/to/your/jquery.min.js"></script>
	...
</head>
```
Alternatively, you can include it from a CDN:
```html
<head>
	...
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
	...
</head>

```

Set aside a place in your site, create a container for displaying the contents.
```html
<div id="content-container">

</div>
```

Create a JavaScript script somewhere in your site's repository, and include it into your site.
```html
<script type="module" src="/path/to/your/script.js"></script>
```

### Step 5a. For loading single/specific content:

In your script, first create a fresh `<div>` element for your content:
```js
let newDiv = document.createElement('div');
```

Give the `<div>` an `id`, set it to any name you like:
```js
newDiv.setAttribute('id',`div-name`);
```

Insert the `<div>` to your container:
```javascript
document.getElementById("content-container").insertAdjacentHTML('beforeend',newDiv.outerHTML);
```

Stating the exact repository file path to the content you want to load(Remember Step 3a):
```js
let filePath = "https://raw.githubusercontent.com/<username>/<username>.github.io.contents/<name_of_main_branch>/contents/content<index>/display.html";
```

Remember your `id` for your `<div>`, load the content in with this jQuery code:
```js
$(`div-name`).load(filePath);
```

### Step 5b. For loading a list of contents:

In your script, first create a fresh `<div>` element for your content:
```js
newDiv = document.createElement('div');
```

We will be loading the contents one by one with loop . Create a few variables:
```js
// The repository file path
let filePath;

// Total number of contents you have or want to load
let contentTotal;

// For creating new <div>
let newDiv;
```

The loop is as follows:
```js
for (let i = 1; i <= contentTotal; i++) {
	// State new file path after each loop.
	filePath = `https://raw.githubusercontent.com/<username>/<username>.github.io.contents/<name_of_main_branch>/contents/content${i}/display.html`;
	
	// Create project element
	newDiv = document.createElement('div');
	newDiv.setAttribute('id',`content-${i}`);
	
	// Insert project element to container
	document.getElementById("content-container").insertAdjacentHTML('beforeend',projDiv.outerHTML);
	
	// Load project from https://github.com/JiayuanWen/JiayuanWen.github.io.data
	$(`content-${i}`).load(filePath);

}
```

## Step 7. Enjoy!

Test out your site, you should now see your container occupied with contents from your content repository. 

You can stylize them with stylesheets from your site's repository, or you can create a dedicate stylesheet for specific content, place it in content repository, then associate it with said content like you do in Step 3.  The creative choices are yours. 

## Final Thoughts

I hope you find this tutorial helpful. If you need a working example, feel free to check out my [website](https://jiayuanwen.github.io/), the [source code](https://github.com/JiayuanWen/jiayuanwen.github.io/blob/main/js/MyProjects.js), and my own [content repository](https://github.com/JiayuanWen/projects) for how I list my projects in my site.  

