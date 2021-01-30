const baseOverride = `
<div class="special-dice-roller sdr-system-{{system}}">
    <div>
        {{#flavorText}}
        <span class="flavor-text">{{flavorText}}</span>
        {{/flavorText}}
        <form>
            <div class="ore-sets">
                {{#setRolls}}
                <div class="ore-set-roll" data-width="{{width}}" data-height="{{height}}">
                    {{#rollsInSet}}
                    <input
                        class="{{#wasReRoll}}special-dice-roller-was-re-roll{{/wasReRoll}}"
                        type="checkbox"
                        style="background-image: url('modules/special-dice-roller/public/images/{{system}}/{{imageName}}.png')"
                        name="roll{{rollIndex}}"
                        data-die="{{die}}"
                        data-face="{{face}}"
                    >
                    {{/rollsInSet}}
               </div>
                {{/setRolls}}
            </div>
            <div class="ore-loose-dice">
                {{#looseDiceRolls}}
                <input
                    class="{{#wasReRoll}}special-dice-roller-was-re-roll{{/wasReRoll}}"
                    type="checkbox"
                    style="background-image: url('modules/special-dice-roller/public/images/{{system}}/{{imageName}}.png')"
                    name="roll{{rollIndex}}"
                    data-die="{{die}}"
                    data-face="{{face}}"
                >
                {{/looseDiceRolls}}
            </div>
        </form>
    </div>
</div>
`;

export default baseOverride;
