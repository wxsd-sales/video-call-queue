<script lang="ts">
  import { formStore } from '$lib/store';
  export let displayFootnote: boolean;
</script>

<div class="is-flex mr-2 mb-1 formFooter">
  <div class="is-flex is-clickable footnote is-align-items-center mr-1">
    <span class="icon is-small">
      <i class="mdi mdi-24px mdi-eye-{!displayFootnote ? '' : 'off-'}outline" />
      <input
        type="checkbox"
        class="is-clickable maskInput"
        name="displayFootnote"
        bind:checked={displayFootnote}
        on:input={(e) => {
          $formStore['displayFootnote'] = e.target.checked;
        }}
      />
    </span>
  </div>
  <div
    class:has-text-grey-light={!displayFootnote}
    class:is-italic={!displayFootnote}
    class="pl-1 has-text-centered has-text-weight-medium is-hidden-mobile"
  >
    <p>
      Made with
      <span class="icon-text has-text-danger">
        <i class="mdi mdi-heart" />
      </span>
      by the WXSD team (wxsd@external.cisco.com)
    </p>
  </div>
</div>

<style>
  .formFooter {
    width: 100%;
    justify-content: flex-end;
  }
  .footnote {
    z-index: 2;
  }

  .maskInput {
    opacity: 0;
    outline: none;
    position: absolute;
  }
</style>
