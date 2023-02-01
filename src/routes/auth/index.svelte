<script lang="ts" context="module">
  export const prerender = false;
</script>

<section class="container p-4 is-align-items-center" id="login">
  <div class="columns is-multiline">
    <div class="column is-12 is-hidden">
      <input class="input is-rounded is-medium is-fullwidth" name="provider" value="webex" readonly disabled />
    </div>
    <div class="column is-12">
      <h1 class="title">Video Calling Queue</h1>
      <h2 class="subtitle pt-2 pl-1">Demo Builder</h2>
    </div>
    <div class="column is-12">
      <hr />
    </div>
    <div class="column is-12">
      <article class="message is-info is-medium">
        <div class="message-header is-hidden" />
        <div class="message-body content">
          <p>
            Demonstrate a branded WebRTC call queue! Applicable to a broad set of B2C use-cases. Connect banking
            consumers to mortgage specialists, or clinicians from patient rooms; this tool will help you explore the
            art-of-the-possible through Webex programmability!
          </p>
          <p>
            Please watch the <span
              ><a target="_blank" href="https://app.vidcast.io/share/d5289588-9810-4e4a-9ea5-b85b61816cc3">vidcast</a
              ></span
            > for a quick walk-through.
          </p>
        </div>
      </article>
    </div>
    <div class="column is-12">
      <a
        class="button is-rounded is-medium is-fullwidth is-primary has-text-weight-bold"
        type="button"
        href={'auth/webex/redirect'}
      >
        <span class="icon">
          <i class="mdi mdi-login" />
        </span>
        <span>Login with Webex</span>
      </a>
    </div>
  </div>
</section>
