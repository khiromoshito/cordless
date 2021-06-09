
module.exports = {
    UNKNOWN: 0,

    /** Argument count is lacking */
    LACK_ARGS: 1,

    /** Argument count exceeded maximum argument count */
    EXCESS_ARGS: 2,

    /** Given argument type does not match with expected type */
    UNMATCHED_ARG: 3,

    /** Argument value does not match with the expected choices */
    INVALID_VALUE: 4,

    /** Command author does not have enough permissions to execute command */
    NO_PERMISSION: 5,
};

