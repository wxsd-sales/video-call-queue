<script lang="ts">
  export let name: string;
  export let description: string;
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Create a New Demo</h2>
    <article class="message is-info is-medium">
      <div class="message-header is-hidden" />
      <div class="message-body content ">
        <p class="is-italic">
          A <strong>"Demo"</strong> is a single Video Queue implementation accessible by multiple requestors and responders.
          This means multiple users can request support from a single requestor URL and multiple responders can access and
          respond to the stack of queued requests published on a single responder URL. No authentication has been implemented
          for simplicity.
        </p>
        <p class="has-text-weight-semibold">
          We highly recommend you create an individual "Demo" per customer or use case in order to avoid cross-talk!
        </p>
      </div>
    </article>
  </div>
  <div class="column is-full">
    <label class="label" for="name">Name <sup class="has-text-danger" title="required">*</sup></label>
    <div class="control ">
      <input
        name="name"
        id="name"
        class="input"
        type="text"
        minlength="6"
        maxlength="64"
        placeholder="Video Calling Queue Demo"
        bind:value={name}
      />
      <span class="icon is-left" />
    </div>
    <div class="help">
      <p>This is only for your reference</p>
    </div>
  </div>
  <div class="column is-full">
    <label class="label" for="description">Description</label>
    <textarea
      name="description"
      id="description"
      class="textarea"
      maxlength="256"
      placeholder="A few lines..."
      bind:value={description}
    />
    <div class="help">
      <p>This is only for your reference</p>
    </div>
  </div>
</div>
