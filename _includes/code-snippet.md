{% assign code = include.code %}
{% assign language = include.language %}
{% assign nanosecond = "now" | date: "%N" %}

```{{ language }}
{{ code }}
```
{: #code{{ nanosecond }}}

<button class="btn btn-primary" id="copybutton{{ nanosecond }}" data-clipboard-target="#code{{ nanosecond }}">
  Copy Snippet
</button>

<script src="/assets/js/clipboard.js"></script>
<script>
var copybutton = document.getElementById('copybutton{{ nanosecond }}');
var clipboard{{ nanosecond }} = new ClipboardJS(copybutton);

clipboard{{ nanosecond }}.on('success', function(e) {
    var originalText = e.trigger.innerHTML;
    e.clearSelection();
    e.trigger.textContent = "Copied";
    e.trigger.classList.add("is-success");
    window.setTimeout(function() {
      e.trigger.textContent = originalText;
      e.trigger.classList.remove("is-success");
    }, 1000);
});
clipboard{{ nanosecond }}.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});
</script>
