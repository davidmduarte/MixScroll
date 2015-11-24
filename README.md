# MixScroll

```html
<h2>Example of code</h2>

<pre>
    <div class="container">
        <div class="block two first">
            <h2>Your title</h2>
            <div class="wrap">
            //Your content
            </div>
        </div>
    </div>
</pre>
```

[click here](https://rawgit.com/davidmduarte/MixScroll/master/index.html)

**How it works**

Add this 2 lines to the header of your html:

  <link rel="stylesheet" type="text/css" href="MixScroll.css" />
  <script type="text/javascript" src="MixScroll.js"></script>

Add this script at the end of the body of your html:

   <script type="text/javascript">
   mixScroll();
   </script>

For a simple scroll down page:

   ...
   <div id="dmdContainer">
      <div class="section">Page 1</div>
      <div class="section">Page 2</div>
      <div class="section">Page 3</div>
      ...
   </div>
   ...

The id **dmdContainer** and the class **section** are mandatory.
