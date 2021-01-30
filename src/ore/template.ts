const baseOverride = `
<div class="special-dice-roller sdr-system-{{system}}">
    <div>
        {{#flavorText}}
        <span class="flavor-text">{{flavorText}}</span>
        {{/flavorText}}
        <form>
            {{#rolls}}
            <input
                class="{{#wasReRoll}}special-dice-roller-was-re-roll{{/wasReRoll}}"
                type="checkbox"
                style="background-image: url('modules/special-dice-roller/public/images/{{system}}/{{imageName}}.png')"
                name="roll{{rollIndex}}"
                data-die="{{die}}"
                data-face="{{face}}"
            >
            {{/rolls}}
        </form>
    </div>
</div>
`;

export default baseOverride;
