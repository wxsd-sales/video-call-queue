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
            Looking to demonstrate a branded Video Concierge Use Case powered by Webex? You've come to the right place!
          </p>
          <p>
            This application will help you explore a broad set of business-to-consumer Kiosk use cases for
            cloud-registered.
          </p>
          <p>
            Bundle with Webex Calling to showcase standards based SIP connecting banking consumers to mortgage
            specialists, quickly connect clinicians from patient rooms or direct visitors in a lobby to their
            appointments! Explore the art-of-the-possible through Webex programmability!
          </p>
          <p>
            Please watch the <span
              ><a target="_blank" href="https://app.vidcast.io/share/fd2c4347-f94e-4c0c-9a39-348397abed73">vidcast</a
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
